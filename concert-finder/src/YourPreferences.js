import './YourPreferences.css';
import mockArtistsDatabase from './MockArtistsDatabase.js';
import Header from './Header.js'
import axios from 'axios';
import './Header.css'
import {useEffect, useState} from "react";
import ConcertsNearby from './ConcertsNearby.js';

// import { useNavigate } from "react-router-dom";
// import { VscAccount } from "react-icons/vsc";


const YourPrefences = () => {
    
    const [artistsArray, setArtistsArray] = useState([]);
    const top20Genres = Array.from(new Set(artistsArray.flatMap(artist => artist.genres))).slice(0, 20);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedArtist, setSelectedArtist] = useState('');

            const handleArtistClick = (artistName) => {
                console.log("getting concerts for: ", artistName)
                setSelectedArtist(artistName);
                // You could also fetch concerts here or trigger any other action
            };
            

    useEffect(() => {
        // const token = window.localStorage.getItem("token");
        // if (!token) {
        //     console.log("No token found. User might not be logged in.");
        //     // Redirect to login or show a message
        //     return;
        // }
        

        const getTopArtists = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:5000/top_artists', {
                    credentials: 'include'  // Ensures cookies are sent with the request if using session-based authentication
                });
                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    setArtistsArray(data.items);  // Assuming the Spotify API response structure
                } else {
                    throw new Error(data.error || 'Failed to fetch top artists');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
    

        };

        getTopArtists();
    }, []); // Empty dependency array means this effect will only run once after the component mounts

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    const handleBack = () => {
        setSelectedArtist(''); // Resets the selected artist, showing the main view
    };
    if (selectedArtist) {
        return <ConcertsNearby artistName={selectedArtist} onBack={handleBack}/>;
    }
    return(
      <div className='YourPreferences'>
           <Header></Header>
           <div className='title'>Your Music Profile</div> 
           <div className='artistMenu-container'>
           <div className='subtitle'>Top Artists</div>
            {artistsArray.length > 0 && (
            <div className="scrollmenu">
                {artistsArray.map((artist) => (
                    <div key={artist.id} class="img-wrapper" onClick={() => handleArtistClick(artist.name)}>
                        <img src={artist.images[0].url} alt={artist.name} />
                    </div>
                ))}  
  
            </div>
                )}{selectedArtist && <ConcertsNearby artistName={selectedArtist} />}
            </div>

          <div className='genMenu-container'>
          <div className='subtitle-genres'>Top Genres</div>
          <div className="scrollmenu-genres">
            {top20Genres.map((genre, index) => (
              <div key={index} className="genre">
                {genre}
              </div>
            ))}
          </div>
        </div>
            
      </div>
      );

    
}

export default YourPrefences;