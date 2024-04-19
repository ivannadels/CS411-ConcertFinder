import './YourPreferences.css';
import mockArtistsDatabase from './MockArtistsDatabase.js';
import Header from './Header.js'
import './Header.css'
// import { useNavigate } from "react-router-dom";
// import { VscAccount } from "react-icons/vsc";

const artistsArray = mockArtistsDatabase.items;
const allGenres = new Set();
    artistsArray.forEach(artist => {
        artist.genres.forEach(genre => {
            allGenres.add(genre);
        });
    });

const top20Genres = Array.from(allGenres).slice(0, 20);

const YourPrefences = () => {
    
    console.log(artistsArray[0].images[0].url);
    return(
      <div className='YourPreferences'>
           <Header></Header>
           <div className='title'>Your Music Profile</div> 
           <div className='artistMenu-container'>
           <div className='subtitle'>Top Artists</div>
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

export default YourPrefences