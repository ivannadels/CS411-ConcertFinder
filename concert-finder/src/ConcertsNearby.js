import React, { useState, useEffect } from 'react';
import Header from './Header';
import './ConcertsNearby.css';
import ConcertListing from './ConcertListing';

const ConcertsNearby = () => {
    const [concerts, setConcerts] = useState([])
    var testData = ['usher','melanie'];

    useEffect(() => {
        const fetchForSingleArtist = async (artistName) => {
            try {
                const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=1SEJhoe033bJEB4YcShG5T5CzLsmjHqs&keyword=${artistName}&locale=*&city=boston`)
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching concerts for", artistName, error)
                return [];
            } 
        }

        const fetchForAllArtists = async () => {
            const allConcerts = await Promise.all(
                testData.map((artistName) => fetchForSingleArtist(artistName)));
            console.log(allConcerts)
            setConcerts(allConcerts.flat());
        };
        
        fetchForAllArtists();
        
    }, []); 

    return (
        <div className='concertsNearby'>
            <Header></Header>
            <div className='title'>Concerts Near You</div>
            <div>
                {concerts.map((concert, index) => (
                    <div>
                        {concert._embedded?.events.map((concert) => (
                            <ConcertListing
                                id={concert.id}
                                artistName={concert._embedded?.attractions?.[0]?.name || 'Unknown Artist'}
                                location={concert._embedded?.venues?.[0]?.name || 'Unknown Venue'}
                                city={concert._embedded?.venues?.[0]?.city?.name || 'Unknown City'}
                                state={concert._embedded?.venues?.[0]?.state?.name || 'Unknown State'}
                                datetime={concert.dates?.start?.dateTime || 'Unknown Date'}
                                url={concert.url || '#'}
                            >
                            </ConcertListing>
                        ))}
                    </div>
                ))} 
            </div>
            
        </div>
    )
}

export default ConcertsNearby