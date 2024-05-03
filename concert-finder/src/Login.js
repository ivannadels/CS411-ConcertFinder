import React from 'react';
import {useEffect, useState} from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import background from "./imgs/concert-img.png"
import './YourPreferences.js'
import { registerUser } from './apiServices'; 


const backend = "http://127.0.0.1:5000"

const Login = () => {

  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [showSpotifyButton, setShowSpotifyButton] = useState(false)
  const [showLocationInput, setShowLocationInput] = useState(true)
  const [fadeOut, setFadeOut] = useState(false);

  const goToMain=()=>{
    navigate("/YourPreferences");
  };

  const handleClick = async ()=>{
    setShowSpotifyButton(true)
    setFadeOut(true)

    try {
        const response = await registerUser({
            user_id: '1', // Assuming fixed user ID for demonstration
            location: location
        });
        
        console.log('User created:', response);
        setShowLocationInput(false); // Hide input after successful submission

    } catch (error) {
        console.error('Error creating user:', error);
        // Optionally reset the fadeOut and Spotify button states if needed
    }


  };
  
  const loginWithSpotify = () => {
    // const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&response_type=${RESPONSE_TYPE}`;
    // window.location.href = url;
    window.location.href = backend + "/login"
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
       
    
    if (hash) {
        const newToken = hash.substring(1)
                          .split("&")
                          .find(elem => elem.startsWith("access_token"))
                          .split("=")[1];

        if (newToken) {
            token = newToken; // Update the token with the new one from URL
            window.location.hash = ""; // Clear hash from URL
            window.localStorage.setItem("token", token); // Store the new token in localStorage
            console.log("Logged In");
            goToMain(); // Only call goToMain if a new token is obtained
        }
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
                {showLocationInput && (
                    <input
                        id="location"
                        className={`login-info ${fadeOut ? 'fade-out' : ''}`}
                        type="text"
                        placeholder='Enter your city'
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    >
                    </input>
                )}

                {showLocationInput && (
                    <button 
                        onClick={handleClick} 
                        className={`buttons ${fadeOut ? 'fade-out' : ''}`}
                        id="continueButton">
                        Continue
                    </button>
                )}
                {showSpotifyButton && (
                    <button onClick={loginWithSpotify} className="buttons" id="spotifyLoginButton">
                        Login with Spotify
                    </button>
                )}
            </div>
        </div>
      </div>
    );
}      

export default Login;