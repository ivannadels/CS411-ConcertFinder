from flask import Flask, jsonify, request, redirect, url_for, session
from flask_dance.contrib.spotify import make_spotify_blueprint
import os
import requests

app = Flask(__name__)

# Replace 'YourSpotifyClientID' and 'YourSpotifyClientSecret' with your actual environment variable names
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")
spotify_bp = make_spotify_blueprint(
    client_id=os.getenv("YourSpotifyClientID"),
    client_secret=os.getenv("YourSpotifyClientSecret"),
    redirect_uri="http://localhost:5000/login/spotify/authorized"
)
app.register_blueprint(spotify_bp, url_prefix="/login")

# Replace 'YourEnvVarNameForKey' and 'YourEnvVarNameForSecret' with the actual names of your environment variables
TICKETMASTER_KEY = os.getenv('JsLud0NzAoeARJHiDUMYJKMH2VGJpQpG')
TICKETMASTER_SECRET = os.getenv('9buo5w3RxlSsmbT8')

@app.route('/')
def home():
    return "Welcome to the Concert Finder!"

@app.route("/fetch-top-artists")
def fetch_top_artists():
    if not spotify.authorized:
        return redirect(url_for("spotify.login"))
    # The logic to fetch top artists from Spotify will go here
    return "Spotify integration to be implemented."

def get_concerts_for_artist(artist_name, city):
    if not TICKETMASTER_KEY:
        raise ValueError("Ticketmaster API Key is not set in the environment variables.")
    
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": TICKETMASTER_KEY,
        "keyword": artist_name,
        "city": city,
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return f"Error fetching concerts for {artist_name}: {response.status_code}"

@app.route("/concerts")
def concerts_for_artist():
    artist_name = request.args.get('artist_name')
    city = request.args.get('city', 'Los Angeles')
    if not artist_name:
        return jsonify({"error": "Artist name is required."}), 400
    concerts = get_concerts_for_artist(artist_name, city)
    return jsonify(concerts)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
