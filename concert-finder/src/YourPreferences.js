import './YourPreferences.css';
import mockArtistsDatabase from './MockArtistsDatabase.js';
// import { useNavigate } from "react-router-dom";
// import { VscAccount } from "react-icons/vsc";

const YourPrefences = () => {
    const artistsArray = mockArtistsDatabase.items;
    console.log(artistsArray[0].images[0].url);
    return(
      <div className='YourPreferences'>
           <header>
                <h1>Artist Gallery</h1>
            </header>
            {artistsArray.length > 0 && (
        <div className="scrollmenu">
            {artistsArray.map((artist, index) => (
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