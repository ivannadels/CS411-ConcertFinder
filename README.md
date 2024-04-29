# Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js and npm**: Download and install from [Node.js official website](https://nodejs.org/).
- **Python 3 and pip**: Download and install from [Python's official website](https://python.org/).

# Clone the repository

In bash:

- git clone https://github.com/yourusername/411-FinalProject.git
- cd 411-FinalProject

# Set up the frontend

Navigate to the frontend directory:

- cd concert-finder
- npm install
- npm start

This will serve the frontend at [http://localhost:3000](http://localhost:3000).

# Set up the backend

In a new terminal window:

- cd ../backend
- pip install -r requirements.txt
- create .env file with 
CLIENT_ID="your key"
CLIENT_SECRET="your key"

- python -m flask --app spotify.py run


This will serve the backend at [http://127.0.0.1:5000](http://127.0.0.1:5000).

# Running the Application

With both servers running, you can access the full functionality of Concert Compass through your browser:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
