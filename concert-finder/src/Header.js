import React from 'react';
import './Header.css';
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { VscCompass } from "react-icons/vsc";

const Header = () => {
    const navigate = useNavigate();

    const goToConcertsNearby=()=> {
        navigate("/ConcertsNearby")
    };
    const goToMusicProfile=()=>  {
        navigate("/YourPreferences")
    };
    const goToSavedConcerts=()=>  {
        navigate("/SavedConcerts")
    };

    const [token, setToken] = useState("");

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
        if(window.localStorage.getItem("token")==null){
            console.log("Logged Out");
        }
        navigate("/")
    }

    return (
        <div className='Header'>
            <button
                onClick={()=>goToConcertsNearby()}
                className="headerButton"
                id="concerts-nearby"
            >
                Concerts Near You
            </button>
            <button 
                onClick={()=>goToSavedConcerts()}
                className='headerButton'
                id="saved-concerts"
            >
                Saved Concerts
            </button>
            <button 
                onClick={()=>goToMusicProfile()}
                className='headerButton'
                id='music-profile'
            >
                Your Music Profile
            </button>
            <button onClick={logout} className="Button" id="spotifyLogoutButton">
                        Logout with Spotify
            </button>

            <span className="hello">
            <VscCompass>
            style={{
                height: 30, 
                width: 30, 
                color: '#ffffff'}}
            </VscCompass>
            Hello User!</span>
        </div>
    )
}

export default Header;