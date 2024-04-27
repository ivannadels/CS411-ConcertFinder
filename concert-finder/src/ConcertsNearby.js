import React, { useState, useEffect } from 'react';
import Header from './Header';
import moment from 'moment';
import './ConcertsNearby.css';
//import './server.js';
import ConcertListing from './ConcertListing';

const ConcertsNearby = () => {
    const [concerts, setConcerts] = useState([])
    var testData = ['usher','melanie', 'shakira'];

    useEffect(() => {
        const fetchForSingleArtist = async (artistName) => {
            try {
                const urlAPI = `https://app.ticketmaster.com/discovery/v2/events?apikey=1SEJhoe033bJEB4YcShG5T5CzLsmjHqs&keyword=${artistName}&locale=*&city=boston`;
                const response = await fetch(urlAPI, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000'
                    }
                });
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

    function formatDate (date, time) {
        JSON.stringify(date)
        JSON.stringify(time)
        const formattedDate = moment(date).format('MMMM Do YYYY');
        const formattedTime = moment(time, "HH:mm:ss").format('h:mm a')
        console.log(time)
        return formattedDate + ' ' + formattedTime
    };

    return (
        <div className='concertsNearby'>
            <Header></Header>
            <div className='title'>Concerts Near You</div>
            <div style={{position:'fixed', top:'215px'}}>
                {concerts.map((concert, index) => (
                    <div key={index}>
                        {concert._embedded?.events.map((concert) => (
                            <ConcertListing
                                key={concert.id}
                                artistName={concert._embedded?.attractions?.[0]?.name || 'Unknown Artist'}
                                location={concert._embedded?.venues?.[0]?.name || 'Unknown Venue'}
                                city={concert._embedded?.venues?.[0]?.city?.name || 'Unknown City'}
                                state={concert._embedded?.venues?.[0]?.state?.name || 'Unknown State'}
                                datetime={formatDate(concert.dates?.start?.localDate, concert.dates?.start?.localTime) || 'Unknown Date'}
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