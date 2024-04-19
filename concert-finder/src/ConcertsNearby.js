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
            console.log(data._embedded.events);
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
        <div className='concertsNearby'>
            <Header></Header>
            <div className='title'>Concerts Near You</div>
            <div>
                {concerts.map((concert) => (
                    <ConcertListing
                        artistName={concert._embedded.attractions[0].name}
                        location={concert._embedded.venues[0].name}
                        city={concert._embedded.venues[0].city.name}
                        time={concert.dates.start.dateTime}
                    >
                    </ConcertListing> 
                ))} 
            </div>
            
        </div>
    )
}

export default ConcertsNearby