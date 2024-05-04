import React, { useEffect, useState } from 'react';
import Header from './Header';
import './SavedConcerts.css';
import moment from 'moment';
import { getSavedConcerts, removeConcert, saveConcert } from './apiServices';
import SavedLists from './SavedLists';

const SavedConcerts = () => {
    const [concerts, setConcerts] = useState([]);

    useEffect(() => {
        fetchConcerts();
    }, []);

    const fetchConcerts = async () => {
        try {
            const data = await getSavedConcerts();
            setConcerts(data);
        } catch (error) {
            console.error('Error fetching saved concerts:', error);
        }
    };
  
    return (
        <div className='SavedConcerts'>
            <Header></Header>
            <div className='title'>Your Saved Concerts</div>
            <ul className = 'ConcertContainer'>
                {concerts.map(concert => (
                    <SavedLists
                    id={concert._id}
                    artist={concert.artist || 'Unknown Artist'}
                    location={concert.venue || 'Unknown Venue'}
                    city={concert.location || 'Unknown City'}
                    datetime={concert.date || 'Unknown Date'}
                    url={concert.url || '#'}
                />
                ))}
                {concerts.length === 0 && <p>No saved concerts to display.</p>}
            </ul>
        </div>
    );
};

export default SavedConcerts;