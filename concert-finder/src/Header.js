import React from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {

    return (
        <div className='Header'>
            <button
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
                className='headerButton'
                id='music-profile'
            >
                Your Music Profile
            </button>
        </div>
    )
}

export default Header;