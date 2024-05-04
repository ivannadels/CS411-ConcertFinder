import React from 'react';
import './SavedLists.css';
import { removeConcert } from './apiServices';
import { useState } from 'react';

const SavedLists = (props) => {
    const [concerts, setConcerts] = useState([]);
    const handleRemove = async (id) => {
        try {
            await removeConcert(id); // Assuming removeConcert is a function that removes a concert by ID
            setConcerts(concerts.filter(concert => concert._id !== id));
        } catch (error) {
            console.error('Error removing concert:', error);
        }
    };
    
    return (
        <div className='Concerts'>
            <div className='EventInfo'>
                <span style={{gridColumn: '1'}}>{props.artist}</span>
                <span style={{gridColumn: '2'}}>{props.location}</span>
                <span style={{gridColumn: '3'}}>{props.city}</span>
                <span style={{gridColumn: '4'}}>{props.datetime}</span>
            </div>
           
            <div className='Delete'>
                <button className='delete-button' onClick={() => handleRemove()}>
                <img src="/delete-icon.png"></img>
                </button>

            </div>
        </div>  
    )
}

export default SavedLists; 