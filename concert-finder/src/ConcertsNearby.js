import React, { useState, useEffect } from 'react';
import Header from './Header';
import moment from 'moment';
import './ConcertsNearby.css';
import ConcertListing from './ConcertListing';

const ConcertsNearby = (props) => {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    var ARTIST = props.artist;
    var CITY = `boston`;

    useEffect(() => {
        fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=1SEJhoe033bJEB4YcShG5T5CzLsmjHqs&keyword=${ARTIST}&locale=*&city=${CITY}`)
            .then((results) => {
                return results.json();
        })
        .then((data) => {
            console.log(data._embedded.events);
            setConcerts(data._embedded.events);
            setLoading(false)
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
            <div className='listingsContainer'>
                {loading ? (
                    <div>Loading...</div>
                ) : concerts.length === 0 ? (
                    <div>No concerts found</div>
                ) : (
                    concerts.map((concert) => (  
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
                    ))
                )}
                 
            </div>
            
        </div>
    )
}

export default ConcertsNearby