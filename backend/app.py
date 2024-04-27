from flask import Flask, jsonify, redirect, url_for, session, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_dance.contrib.spotify import make_spotify_blueprint, spotify
from flask_apscheduler import APScheduler
from celery import Celery
import os
import requests

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or 'mysecretkey'  # Fallback to a default secret
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://app_user:user_password@localhost/concert_finder'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class SavedConcert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    venue = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
# Initialize scheduler
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()
# Ticketmaster API key
TICKETMASTER_KEY = os.getenv('TICKETMASTER_KEY')


# Setup Spotify OAuth blueprint
spotify_bp = make_spotify_blueprint(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope='user-library-read user-top-read playlist-read-private user-read-recently-played'
)
app.register_blueprint(spotify_bp, url_prefix="/login")

def refresh_spotify_data():
    print("Refreshing Spotify data...")
    # Example: Fetch top artists for each user
    for user in User.query.all():
        if user.spotify_authorized:
            response = spotify.get(f'https://api.spotify.com/v1/users/{user.spotify_id}/top/artists')
            if response.ok:
                # Process and save the data
                top_artists = response.json()['items']
                user.top_artists = top_artists  # Assuming there's a field to store this
                db.session.commit()
            else:
                print("Failed to refresh data for user:", user.username)

def save_events(events, user_id):
    """
    Save or update events in the database.
    Args:
    events (list): List of event dictionaries to be processed.
    user_id (int): ID of the user for whom events are being saved.
    """
    for event in events:
        # Assume each event dictionary has 'id', 'name', 'venues', and 'dates' keys
        concert_id = event['id']
        artist_name = event['name']
        venue_name = event['venues'][0]['name'] if event['venues'] else 'Unknown Venue'
        location = event['venues'][0]['city']['name'] if event['venues'] else 'Unknown Location'
        concert_date = event['dates']['start']['localDate']

        # Check if the concert already exists in the database
        concert = SavedConcert.query.filter_by(id=concert_id).first()
        if concert:
            # Update existing concert if exists
            concert.artist = artist_name
            concert.venue = venue_name
            concert.location = location
            concert.date = concert_date
        else:
            # Create new concert entry if not exists
            concert = SavedConcert(
                id=concert_id,
                user_id=user_id,
                artist=artist_name,
                venue=venue_name,
                location=location,
                date=concert_date
            )
            db.session.add(concert)

    # Commit changes to the database
    db.session.commit()
def update_ticketmaster_data():
    print("Updating Ticketmaster data...")
    artists = {concert.artist for concert in SavedConcert.query.distinct(SavedConcert.artist)}
    for artist in artists:
        response = requests.get(f"https://app.ticketmaster.com/discovery/v2/events.json",
                                params={"apikey": TICKETMASTER_KEY, "keyword": artist})
        if response.ok:
            events = response.json().get('_embedded', {}).get('events', [])
            # Call save_events here, assuming a user_id
            save_events(events, user_id=1)  # Replace '1' with the appropriate user ID
        else:
            print("Failed to update data for artist:", artist)
def schedule_jobs():
    scheduler.add_job(refresh_spotify_data, 'cron', hour=2)
    scheduler.add_job(update_ticketmaster_data, 'interval', hours=6)



# Routes and route handlers

@app.before_first_request
def initialize():
    db.create_all()
    schedule_jobs()

def schedule_jobs():
    scheduler.add_job(refresh_spotify_data, 'cron', hour=2)
    scheduler.add_job(update_ticketmaster_data, 'interval', hours=6)

@app.route('/')
def index():
    return redirect(url_for('spotify_login'))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    city = data['city']
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 409
    new_user = User(username=username, city=city)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/spotify_login')
def spotify_login():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('/me')
    if not resp.ok:
        return jsonify({'error': 'Failed to fetch user data'}), 502
    return jsonify({'welcome_message': f"Welcome, {resp.json()['display_name']}!"})

@app.route('/top_artists')
def get_top_artists():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/top/artists')
    assert resp.ok, resp.text
    artists = [artist['name'] for artist in resp.json()['items']]
    return jsonify(artists)
@app.route('/saved_tracks')
def get_saved_tracks():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/tracks')
    if not resp.ok:
        return "Error fetching saved tracks", 400
    tracks = [track['track']['name'] for track in resp.json()['items']]
    return jsonify(tracks)

@app.route('/playlists')
def get_playlists():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/playlists')
    if not resp.ok:
        return "Error fetching playlists", 400
    playlists = [playlist['name'] for playlist in resp.json()['items']]
    return jsonify(playlists)

@app.route('/listening_history')
def get_listening_history():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/player/recently-played')
    if not resp.ok:
        return "Error fetching listening history", 400
    tracks = [item['track']['name'] for item in resp.json()['items']]
    return jsonify(tracks)

@app.route('/events/<artist_name>')
def get_events_for_artist(artist_name):
    events = search_events(artist_name)
    return jsonify(events)

@app.route('/logout')
def logout():
    if spotify.authorized:
        token = spotify.token["access_token"]
        spotify.post("https://accounts.spotify.com/api/token/revoke", params={"token": token})
        del spotify.token
    return redirect(url_for('index'))

# Helper function to search events via Ticketmaster
def search_events(artist_name):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "keyword": artist_name,
        "apikey": TICKETMASTER_KEY,
    }
    response = requests.get(url, params=params)
    return response.json() if response.ok else {"error": response.text, "status_code": response.status_code}

@app.route("/concerts")
def concerts_for_artist():
    artist_name = request.args.get('artist_name')
    city = request.args.get('city', 'Los Angeles')
    if not artist_name:
        return jsonify({"error": "Artist name is required."}), 400
    try:
        concerts = get_concerts_for_artist(artist_name, city)
        return jsonify(concerts)
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Failed to fetch concerts: {str(e)}")
        return jsonify({"error": "Failed to fetch concerts"}), 500

# Function to get concerts for a given artist and city
def get_concerts_for_artist(artist_name, city):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": TICKETMASTER_KEY,
        "keyword": artist_name,
        "city": city,
    }
    response = requests.get(url, params=params)
    return response.json() if response.ok else {"error": "Error fetching concerts", "status_code": response.status_code}

@app.errorhandler(500)
def internal_error(error):
    return "An error occurred: {}".format(error), 500

@app.route('/login/spotify/authorized')
def spotify_authorized():
    # You can fetch and store the token here if needed
    return redirect(url_for('index'))  # Redirect to the main page or dashboard

# Main entry point
if __name__ == "__main__":
    app.run(debug=True)


