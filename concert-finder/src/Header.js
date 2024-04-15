import React from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const goToConcertsNearby=()=> {
        navigate("/ConcertsNearby")
    };
    const goToMusicProfile=()=>  {
        navigate("/YourPreferences")
    };
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

            <span className="hello">Hello User!</span>
        </div>
    )
}

export default Header;