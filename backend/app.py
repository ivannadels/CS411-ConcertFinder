from flask import Flask, jsonify, redirect, url_for, session, request
from flask_dance.contrib.spotify import make_spotify_blueprint, spotify
import os
import requests

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or 'mysecretkey'  # Fallback to a default secret

# Setup Spotify OAuth blueprint
spotify_bp = make_spotify_blueprint(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope='user-library-read'  # Specify additional scopes if needed
)
app.register_blueprint(spotify_bp, url_prefix="/login")

# Ticketmaster API key
TICKETMASTER_KEY = os.getenv('TICKETMASTER_KEY')

# Routes and route handlers
@app.route('/')
def index():
    # Redirect to Spotify login if not authorized
    return redirect(url_for('spotify_login'))

@app.route('/spotify_login')
def spotify_login():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('/me')
    assert resp.ok, resp.text
    return f"Welcome, {resp.json()['display_name']}!"

@app.route('/top_artists')
def get_top_artists():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    resp = spotify.get('https://api.spotify.com/v1/me/top/artists')
    assert resp.ok, resp.text
    artists = [artist['name'] for artist in resp.json()['items']]
    return jsonify(artists)

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
    concerts = get_concerts_for_artist(artist_name, city)
    return jsonify(concerts)

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


