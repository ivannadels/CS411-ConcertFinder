# 411-FinalProject -- Concert Compass 
How to set up the environment and launch Concert Compass: 

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js and npm**: Download and install from [Node.js official website](https://nodejs.org/).
- **Python 3 and pip**: Download and install from [Python's official website](https://python.org/).
- **MongoDB**: Download and install using the command:
  - npm install mongodb express cors

## Clone the repository
In bash, enter the following commands:
- git clone https://github.com/yourusername/411-FinalProject.git
- cd 411-FinalProject

This will clone the repo and navigate to the main directory of the project.

## Set up the frontend
Navigate to the frontend directory:
- cd concert-finder

Install npm and run the front end of the application. 
- npm install
- npm start

This will serve the frontend at [http://localhost:3000](http://localhost:3000).

## Set up the backend
In a new terminal window, do the following steps and corresponding commands:

**Navigate to the backend:**
- cd ../backend

**Install all required packages:**
- pip install -r requirements.txt

**Create .env file with CLIENT_ID and CLIENT_SECRET:**
- create .env file with

  - CLIENT_ID="your key"

  - CLIENT_SECRET="your key"

**Run the backend server:**
- python -m flask --app spotify.py run


This will serve the backend at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Start the database 
In the 'server' directory:
- Create a config.env file
- Enter the following into the config.env file
  - ATLAS_URI=mongodb+srv://(username):(password)@(cluster)(projectId).mongodb.net/employees?retryWrites=true&w=majority
  - PORT=5050
Enter the following command in your terminal: 
- node --env-file=config.env server

## Running the Application
With both servers running, you can access the full functionality of Concert Compass through your browser:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
