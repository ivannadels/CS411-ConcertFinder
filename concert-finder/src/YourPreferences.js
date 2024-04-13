import React, { useDebugValue, useEffect } from 'react';
import './Login.css';
import './YourPreferences.css';
import mockArtistsDatabase from './MockArtistsDatabase.js';
// import { useNavigate } from "react-router-dom";
// import { VscAccount } from "react-icons/vsc";

const YourPrefences = () => {
    const artistsArray = mockArtistsDatabase.items;
    console.log(artistsArray[0].images[0].url);
    return(
        <div className="scrollmenu">
            {artistsArray.map((artist, index) => (
                <div key={artist.id}>
                    <img src={artist.images[0].url} alt={artist.name} style={{ width: '100px', height: '100px' }}/>
                </div>
            ))}
           
        </div>
      );

    
}

export default YourPrefences