from flask import Flask, jsonify, redirect, request
import requests
import string
import random
from urllib.parse import urlencode
import base64
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, supports_credentials=True)
# app.config['CORS_HEADERS'] = 'Content-Type'
# app.secret_key = os.getenv("FLASK_SECRET_KEY") or 'mysecretkey'
# app.config["SESSION_TYPE"]  = "filesystem"
# app.config['SESSION_PERMANENT'] = False
# app.config['SESSION_COOKIE_SECURE'] = False
# Session(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.String(512), nullable=True)

    def __repr__(self):
        return '<User %r>' % self.id
    
# Create the database and tables
@app.before_request
def create_tables():
    app.before_request_funcs[None].remove(create_tables)

    db.create_all()

@app.route('/store_token/<int:user_id>/<token>')
def store_token(user_id, token):
    user = User.query.get(user_id)
    if user is None:
        user = User(id=user_id, access_token=token)
        db.session.add(user)
    else:
        user.access_token = token
    db.session.commit()
    return "Token stored successfully"

@app.route('/get_token/<int:user_id>')
def get_token(user_id):
    user = User.query.get(user_id)
    if user and user.access_token:
        return f"Token for user {user_id} is {user.access_token}"
    return "Token not found", 404

load_dotenv()
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

redirect_uri = "http://127.0.0.1:5000/callback"  # Make sure this matches with your Spotify app settings

def randomString(n):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=n))

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/login")
def login():
    state = randomString(15)
    scope = 'user-read-private user-read-email user-top-read'
    
    auth_url = 'https://accounts.spotify.com/authorize?'
    
    params = {
        'response_type': 'code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'scope': scope,
        'state': state
    }
    
    query_params = urlencode(params)
    return redirect(auth_url + query_params)

@app.route("/callback")
def callback():
    code = request.args.get('code')
    error = request.args.get('error')
    if error:
        return f"Error received from Spotify API: {error}", 400

    token_url = "https://accounts.spotify.com/api/token"
    # front_end = "http://localhost:3000/callback"
    
    params = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode('ascii')
    }
    
    response = requests.post(token_url, data=params, headers=headers)
    
    if response.status_code != 200:
        print("no token")
        return f"Failed to receive token: {response.text}", response.status_code
    
   
    access_token = response.json()['access_token']
    user_id = 1  # This should be dynamically determined based on your application's user management logic
    user = User.query.get(user_id) or User(id=user_id)
    user.access_token = access_token
    db.session.add(user)
    db.session.commit()

    return  redirect("http://localhost:3000/YourPreferences")


@app.route('/logout')
def spotify_logout():
    user_id = 1
    if user_id:
        user = User.query.get(user_id)
        if user:
            # Invalidate the token by setting it to None or an empty string
            user.access_token = None
            db.session.commit()
    
    # Redirect to the login page or home page
    return redirect('http://localhost:3000/')


@app.route('/top_artists')
def get_top_artists():
    # Assume the access token is stored in the session
    user_id = 1  # Assume this is fetched based on the current user session or similar logic
    user = User.query.get(user_id)
    if not user or not user.access_token:
        return jsonify({"error": "Authentication required"}), 401

    # token = session.get('access_token')
    # print("In get_top_artists token =", token)
    # if not token:
    #     return jsonify({"error": "Authentication required"}), 401  # Returning 401 if the user is not authenticated

    headers = {
        'Authorization': f'Bearer {user.access_token}'
    }

    # Making a GET request to Spotify's API with the necessary headers
    response = requests.get('https://api.spotify.com/v1/me/top/artists', headers=headers)
    
    if response.ok:
        print(response)
        return jsonify(response.json()), 200  # Return the JSON response from Spotify
        
    else:
        # Log or handle response errors here
        return jsonify({"error": "Failed to fetch top artists", "details": response.text}), response.status_code

@app.route('/saved_tracks')
def get_saved_tracks():
    token, error = get_token(1)
    if error:
        return jsonify({"error": error}), 401

    response = requests.get('https://api.spotify.com/v1/me/tracks', headers={'Authorization': f'Bearer {token}'})
    if response.ok:
        tracks = [track['track']['name'] for track in response.json()['items']]
        return jsonify(tracks)
    return jsonify({"error": "Error fetching saved tracks", "details": response.text}), response.status_code

@app.route('/playlists')
def get_playlists():
    token, error = get_token(1)
    if error:
        return jsonify({"error": error}), 401

    response = requests.get('https://api.spotify.com/v1/me/playlists', headers={'Authorization': f'Bearer {token}'})
    if response.ok:
        playlists = [playlist['name'] for playlist in response.json()['items']]
        return jsonify(playlists)
    return jsonify({"error": "Error fetching playlists", "details": response.text}), response.status_code

@app.route('/listening_history')
def get_listening_history():
    token, error = get_token(1)
    if error:
        return jsonify({"error": error}), 401

    response = requests.get('https://api.spotify.com/v1/me/player/recently-played', headers={'Authorization': f'Bearer {token}'})
    if response.ok:
        tracks = [item['track']['name'] for item in response.json()['items']]
        return jsonify(tracks)
    return jsonify({"error": "Error fetching listening history", "details": response.text}), response.status_code

API_KEY = os.environ.get('TICKETMASTER_API_KEY')
@app.route('/concerts')
def get_concerts():
    
    artist = request.args.get('artist')
    city = request.args.get('city')
    url = f'https://app.ticketmaster.com/discovery/v2/events?apikey={API_KEY}&keyword={artist}&city={city}&locale=*'
    response = requests.get(url)
    data = response.json()

    if (response.ok):
        return jsonify(data)
    return jsonify({"Error fetching concerts in backend:"}, response.text)

if __name__ == '__main__':
    app.run(debug=True, port=5000)