import React, { useState, useEffect } from 'react';
import Header from './Header';
import './ConcertsNearby.css';
import moment from 'moment';
import ConcertListing from './ConcertListing';
import YourPreferences from './YourPreferences';

const ConcertsNearby = (props) => {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    var ARTIST = props.artistName; 
    var CITY = `boston`;
    var onBack = props.onBack;

    useEffect(() => {
        fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=1SEJhoe033bJEB4YcShG5T5CzLsmjHqs&keyword=${ARTIST}&locale=*&location=${CITY}`)
            .then((results) => {
                return results.json();
        })
        .then((data) => {
            if (data._embedded && data._embedded.events) {
                setConcerts(data._embedded.events);
            } else {
                setConcerts([]);
            }
            setLoading(false);
        })
        .catch ((error) => {
            console.error('Error fetching concerts:', error);
            setLoading(false);
        
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

    const handleBack = () => {
        return YourPreferences; // Resets the selected artist, showing the main view
    }

    return (
        <div className='concertsNearby'>
            <Header></Header>
            <div className='title'>Concerts Near You</div>
            <div className='listingsContainer'>
                {loading ? (
                    <div>Loading...</div>
                ) : concerts.length === 0 ? (
                    <div>No concerts found for {props.artistName}</div>
                ) : (
                    concerts.map((concert) => (
                        <ConcertListing
                            key={concert.id}
                            artist={concert._embedded?.attractions?.[0]?.name || 'Unknown Artist'}
                            location={concert._embedded?.venues?.[0]?.name || 'Unknown Venue'}
                            city={concert._embedded?.venues?.[0]?.city?.name || 'Unknown City'}
                            state={concert._embedded?.venues?.[0]?.state?.name || 'Unknown State'}
                            datetime={formatDate(concert.dates?.start?.localDate, concert.dates?.start?.localTime) || 'Unknown Date'}
                            url={concert.url || '#'}
                        />
                    ))
                )}
            </div>
            <div className='backContainer'>
                <button 
                    onClick={handleBack}
                    className='buttons'
                >
                    Back to Artists
                </button>
            </div>
            
        </div>
    );
}

export default ConcertsNearby;