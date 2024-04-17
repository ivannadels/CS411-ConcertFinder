import './YourPreferences.css';
import mockArtistsDatabase from './MockArtistsDatabase.js';
import Header from './Header.js'
import './Header.css'
// import { useNavigate } from "react-router-dom";
// import { VscAccount } from "react-icons/vsc";

const YourPrefences = () => {
    const artistsArray = mockArtistsDatabase.items;
    console.log(artistsArray[0].images[0].url);
    return(
      <div className='YourPreferences'>
           <Header>
            </Header>
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