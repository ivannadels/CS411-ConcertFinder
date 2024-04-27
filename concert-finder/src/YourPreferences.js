import './YourPreferences.css';
import mockArtistsDatabase from './MockArtistsDatabase.js';
import Header from './Header.js'
import axios from 'axios';
import './Header.css'
import {useEffect, useState} from "react";

// import { useNavigate } from "react-router-dom";
// import { VscAccount } from "react-icons/vsc";


const YourPrefences = () => {
    const [artistsArray, setArtistsArray] = useState([]);
    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (!token) {
            console.log("No token found. User might not be logged in.");
            // Redirect to login or show a message
            return;
        }

        const getTopArtists = async () => {
            try {
                const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                console.log(data);
                setArtistsArray(data.items); // Assuming the data structure has an 'items' array
            } catch (error) {
                console.error('Failed to fetch top artists:', error);
                // Handle errors appropriately
            }
        };

        getTopArtists();
    }, []); // Empty dependency array means this effect will only run once after the component mounts

    
    return(
      <div className='YourPreferences'>
           <Header></Header>
           <div className='title'>Your Music Profile</div> 
           <div className='subtitle'>Top Artists</div>
            {artistsArray.length > 0 && (
            <div className="scrollmenu">
                {artistsArray.map((artist) => (
                    <div key={artist.id} class="img-wrapper">
                        <img src={artist.images[0].url} alt={artist.name} />
                    </div>
                ))}    
            </div>
                )}
      </div>
      );

    
}

export default YourPrefences