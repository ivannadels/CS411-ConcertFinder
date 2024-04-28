import React from 'react';
import {useEffect, useState} from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import background from "./imgs/concert-img.png"
import './YourPreferences.js'

const CLIENT_ID = '8ab490097dab43fea4eb13d9f162ef5a';
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = 'token';
const SCOPES = ["user-top-read"];

const Login = () => {

  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [showSpotifyButton, setShowSpotifyButton] = useState(false)
  const goToMain=()=>{
    navigate("/YourPreferences");
  };
  
  const loginWithSpotify = () => {
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&response_type=${RESPONSE_TYPE}`;
    window.location.href = url;
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

        window.location.hash = ""; // Clear hash from URL
        window.localStorage.setItem("token", token); // Store the token in localStorage
    }


    
}, []);

    return (
        <div className="background" style={{ backgroundImage: `url(${background})`}}>
           <div className="Login"> 
            <div className="left-side">
                <div className="Welcome">
                Welcome to <span className='app-name'>Concert Compass</span>
                </div>
                <div style={{margin: 20}}>
                    Concert Compass is an online destination dedicated to helping you discover nearby concerts featuring your favorite artists.  
                </div>
                
            </div>
            <div className="right-side">
                <VscAccount 
                    style={{
                        height: 30, 
                        width: 30, 
                        color: '#f1ee8e'}}>
                    </VscAccount>
                <div className="UserLogin">
                    Get Started Below!
                </div>
                <input
                    id="location"
                    className="login-info"
                    type="text"
                    placeholder='Enter your city'
                >
                </input>

                <button 
                    onClick={()=>goToMain()} 
                    className="Button" 
                    id="continueButton">
                    Continue
                </button>
                <button onClick={loginWithSpotify} className="Button" id="spotifyLoginButton">
                        Login with Spotify
                </button>
                
            </div>
        </div>
      </div>
    );
}      

export default Login;