from flask import Flask
from flask_dance.contrib.spotify import make_spotify_blueprint
import os
import requests

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

# Ensure that your environment variables names in .env are SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REDIRECT_URI
spotify_bp = make_spotify_blueprint(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),  # Key from your .env
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),  # Secret from your .env
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI")  # URI from your .env
)
app.register_blueprint(spotify_bp, url_prefix="/login")

# Ensure that your environment variables names in .env are TICKETMASTER_KEY and TICKETMASTER_SECRET
TICKETMASTER_KEY = os.getenv('TICKETMASTER_KEY')
TICKETMASTER_SECRET = os.getenv('TICKETMASTER_SECRET')


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
