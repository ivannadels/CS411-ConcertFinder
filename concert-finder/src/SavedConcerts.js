import React, { useEffect, useState } from 'react';
import Header from './Header';
import './SavedConcerts.css';
import { getSavedConcerts, removeConcert, saveConcert } from './apiServices';

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

    const handleRemove = async (id) => {
        try {
            await removeConcert(id);
            setConcerts(concerts.filter(concert => concert._id !== id));
        } catch (error) {
            console.error('Error removing concert:', error);
        }
    };

    const handleAdd = async (concertData) => {
        try {
            await saveConcert(concertData);
            fetchConcerts(); // Re-fetch concerts to show the newly added concert
        } catch (error) {
            console.error('Error adding concert:', error);
        }
    };

    return (
        <div className='SavedConcerts'>
            <Header />
            <h2>Your Saved Concerts</h2>
            <ul>
                {concerts.map(concert => (
                    <li key={concert._id}>
                        {concert.artist} at {concert.venue} - {new Date(concert.date).toLocaleDateString()}
                        <button onClick={() => handleRemove(concert._id)}>Remove</button>
                    </li>
                ))}
                {concerts.length === 0 && <p>No saved concerts to display.</p>}
            </ul>
        </div>
    );
};

export default SavedConcerts;