import React, { useState, useEffect } from 'react';
import Header from './Header';
import './ConcertsNearby.css';
import ConcertListing from './ConcertListing';

const ConcertsNearby = () => {
    const [concerts, setConcerts] = useState([])

    useEffect(() => {
        fetch('https://app.ticketmaster.com/discovery/v2/events?apikey=1SEJhoe033bJEB4YcShG5T5CzLsmjHqs&keyword=usher&locale=*&city=boston')
            .then((results) => {
                return results.json();
        })
        .then((data) => {
            console.log(data);
            setConcerts(data._embedded.events);
        });
    }, []);
    return (
        /* <div className='concertsNearby'>
            <Header></Header>
            <div className='title'>Concerts Near You</div>
            <ConcertListing
                artistName='Melanie Martinez'
                location='TD Garden'
                city='Boston'
                time="4pm"
            > 
            </ConcertListing>
        </div> */
        <div>
            {concerts.map((concert) => (
                <ConcertListing>
                    artistName=concert.name
                    location=concert.venue.name
                </ConcertListing>
            ))} 
        </div>
    )
}

export default ConcertsNearby