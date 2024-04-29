from flask import Flask, jsonify, redirect, url_for, request
from flask_bcrypt import Bcrypt
from flask_dance.contrib.spotify import make_spotify_blueprint, spotify
from flask_apscheduler import APScheduler
from flask_pymongo import PyMongo
from celery import Celery
import os
import requests

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or 'mysecretkey'
app.config["MONGO_URI"] = "mongodb://localhost:27017/concert_finder"
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

TICKETMASTER_KEY = os.getenv('TICKETMASTER_KEY')

spotify_bp = make_spotify_blueprint(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_url=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope='user-library-read user-top-read playlist-read-private user-read-recently-played'
)
app.register_blueprint(spotify_bp, url_prefix="/login")

def refresh_spotify_data():
    for user in mongo.db.users.find():
        if user.get('spotify_authorized'):
            response = spotify.get(f'https://api.spotify.com/v1/users/{user["spotify_id"]}/top/artists')
            if response.ok:
                mongo.db.users.update_one({'_id': user['_id']}, {'$set': {'top_artists': response.json()['items']}})
            else:
                print(f"Failed to refresh data for user: {user['username']}")

def save_events(events, user_id):
    for event in events:
        event_data = {
            'user_id': user_id,
            'artist': event['name'],
            'venue': event.get('venues', [{'name': 'Unknown Venue'}])[0]['name'],
            'location': event.get('venues', [{'city': {'name': 'Unknown Location'}}])[0]['city']['name'],
            'date': event['dates']['start']['localDate']
        }
        mongo.db.concerts.update_one({'id': event['id']}, {'$set': event_data}, upsert=True)

def update_ticketmaster_data():
    for artist in mongo.db.concerts.distinct('artist'):
        response = requests.get(f"https://app.ticketmaster.com/discovery/v2/events.json", params={"apikey": TICKETMASTER_KEY, "keyword": artist})
        if response.ok:
            events = response.json().get('_embedded', {}).get('events', [])
            save_events(events, user_id='1')  # Replace '1' with the appropriate user ID

# def schedule_jobs():
#     scheduler.add_job(refresh_spotify_data, 'cron', hour=2, id='refresh_spotify')
#     # scheduler.add_job(update_ticketmaster_data, 'interval', hours=6, id='update_ticketmaster')

# schedule_jobs()

@app.route('/')
def index():
    return redirect(url_for('spotify_login'))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    city = data['city']
    if mongo.db.users.find_one({'username': username}):
        return jsonify({'message': 'User already exists'}), 409
    mongo.db.users.insert_one({'username': username, 'password': password, 'city': city, 'max_travel_distance': 30})
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/spotify_login')
def spotify_login():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('/me')
    if resp.ok:
        return jsonify({'welcome_message': f"Welcome, {resp.json()['display_name']}!"})
    return jsonify({'error': 'Failed to fetch user data'}), 502

@app.route('/top_artists')
def get_top_artists():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/top/artists')
    if resp.ok:
        artists = [artist['name'] for artist in resp.json()['items']]
        return jsonify(artists)
    return "Error fetching top artists", 400

@app.route('/saved_tracks')
def get_saved_tracks():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/tracks')
    if resp.ok:
        tracks = [track['track']['name'] for track in resp.json()['items']]
        return jsonify(tracks)
    return "Error fetching saved tracks", 400

@app.route('/playlists')
def get_playlists():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/playlists')
    if resp.ok:
        playlists = [playlist['name'] for playlist in resp.json()['items']]
        return jsonify(playlists)
    return "Error fetching playlists", 400

@app.route('/listening_history')
def get_listening_history():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/player/recently-played')
    if resp.ok:
        tracks = [item['track']['name'] for item in resp.json()['items']]
        return jsonify(tracks)
    return "Error fetching listening history", 400

@app.route('/events/<artist_name>')
def get_events_for_artist(artist_name):
    events = search_events(artist_name)
    if 'error' in events:
        return jsonify({"error": events["error"]}), 400
    return jsonify(events)

@app.route('/logout')
def logout():
    if spotify.authorized:
        token = spotify.token["access_token"]
        spotify.post("https://accounts.spotify.com/api/token/revoke", params={"token": token})
        del spotify.token
    return redirect(url_for('index'))

@app.route("/concerts")
def concerts_for_artist():
    artist_name = request.args.get('artist_name')
    city = request.args.get('city', 'Los Angeles')
    if not artist_name:
        return jsonify({"error": "Artist name is required."}), 400
    concerts = get_concerts_for_artist(artist_name, city)
    return jsonify(concerts)

def get_concerts_for_artist(artist_name, city):
    response = requests.get("https://app.ticketmaster.com/discovery/v2/events.json", params={"apikey": TICKETMASTER_KEY, "keyword": artist_name, "city": city})
    if response.ok:
        return response.json()
    return {"error": "Error fetching concerts", "status_code": response.status_code}

def search_events(artist_name):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": TICKETMASTER_KEY,
        "keyword": artist_name
    }
    response = requests.get(url, params=params)
    if response.ok:
        return response.json()
    else:
        return {"error": "Failed to fetch events", "status_code": response.status_code}

@app.errorhandler(500)
def internal_error(error):
    return "An error occurred: {}".format(error), 500

if __name__ == "__main__":
    app.run(debug=True)