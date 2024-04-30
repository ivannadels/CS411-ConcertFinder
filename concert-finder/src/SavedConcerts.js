import React, { useEffect, useState } from 'react';
import Header from './Header.js';
import './SavedConcerts.css';
import { getSavedConcerts, removeConcert } from './apiServices'; // ensure this path is correct

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
            console.error('Failed to fetch concerts:', error);
            // show an error message
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeConcert(id);
            fetchConcerts(); // Refresh the concerts after deletion
        } catch (error) {
            console.error('Failed to remove concert:', error);
            //  show an error message
        }
    };

    return (
        <div className='SavedConcerts'>
            <Header />
            <div className='title'>Your Saved Concerts</div>
            <ul>
                {concerts.map((concert) => (
                    <li key={concert._id}>
                        {concert.artist} at {concert.venue} - {concert.date}
                        <button onClick={() => handleRemove(concert._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavedConcerts;