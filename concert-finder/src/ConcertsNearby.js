import React, { useState, useEffect } from 'react';
import Header from './Header';
import './ConcertsNearby.css';
import moment from 'moment';
import ConcertListing from './ConcertListing';

const ConcertsNearby = (props) => {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    var ARTIST = props.artistName; 
    var CITY = `boston`;
    var onBack = props.onBack;

    useEffect(() => {
        const getConcerts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:5000/concerts?artist=${encodeURIComponent(ARTIST)}&city=${encodeURIComponent(CITY)}`, {
                    credentials: 'include'  // Ensures cookies are sent with the request if using session-based authentication
                });
                const data = await response.json();
                console.log(data)
                if (data._embedded && data._embedded.events) {
                    setConcerts(data._embedded.events);
                } else {
                    setConcerts([]);
                }
            } catch (error) {
                console.error('Error fetching concerts:', error);
            } finally {
                setLoading(false)
            }
        }

        getConcerts();
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
        // Resets the selected artist, showing the main view
        if (onBack) {
            props.onBack()
        }   
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