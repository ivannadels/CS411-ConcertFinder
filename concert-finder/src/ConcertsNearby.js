import React, { useState, useEffect } from 'react';
import Header from './Header';
import moment from 'moment';
import './ConcertsNearby.css';
import axios from 'axios'
//import './server.js';
import ConcertListing from './ConcertListing';

const ConcertsNearby = () => {
    const [concerts, setConcerts] = useState([])
    var ARTIST = 'usher';

    useEffect(() => {
        fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=1SEJhoe033bJEB4YcShG5T5CzLsmjHqs&keyword=${ARTIST}&locale=*&city=boston`)
            .then((results) => {
                return results.json();
        })
        .then((data) => {
            console.log(data._embedded.events);
            setConcerts(data._embedded.events);
        });
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
                {concerts.map((concert) => (  
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
            
        </div>
    )
}

export default ConcertsNearby