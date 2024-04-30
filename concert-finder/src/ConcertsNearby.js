import React, { useState, useEffect } from 'react';
import { getConcertsForArtistCity } from './apiServices'; // make sure to import the new function
import Header from './Header';
import './ConcertsNearby.css';
import ConcertListing from './ConcertListing';
import YourPreferences from './YourPreferences';

const ConcertsNearby = ({ artistName, city = 'Boston' }) => {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchConcerts(artistName, city);
    }, [artistName, city]);

    const fetchConcerts = async (artistName, city) => {
        setLoading(true);
        try {
            const data = await getConcertsForArtistCity(artistName, city);
            if (data._embedded && data._embedded.events) {
                setConcerts(data._embedded.events);
            } else {
                setConcerts([]);
            }
        } catch (error) {
            console.error('Error fetching concerts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='concertsNearby'>
            <Header />
            <button onClick={() => YourPreferences()}>Back to Preferences</button>
            <div className='title'>Concerts Near You</div>
            <div className='listingsContainer'>
                {loading ? (
                    <div>Loading...</div>
                ) : concerts.length === 0 ? (
                    <div>No concerts found for {artistName} in {city}</div>
                ) : (
                    concerts.map((concert) => (
                        <ConcertListing
                            key={concert.id}
                            artistName={concert._embedded?.attractions?.[0]?.name || 'Unknown Artist'}
                            location={concert._embedded?.venues?.[0]?.name || 'Unknown Venue'}
                            city={concert._embedded?.venues?.[0]?.city?.name || 'Unknown City'}
                            state={concert._embedded?.venues?.[0]?.state?.name || 'Unknown State'}
                            datetime={concert.dates?.start?.localDate || 'Unknown Date'}
                            url={concert.url || '#'}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ConcertsNearby;