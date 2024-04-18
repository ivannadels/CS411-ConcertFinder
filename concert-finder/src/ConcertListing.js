import React from 'react';
import './ConcertListing.css';

const ConcertListing = (props) => {
    return (
        <div className='Listing'>
            <span>{props.artistName}</span>
            <span>{props.location}</span>
            <span>{props.city}</span>
            <span>{props.time}</span>
        </div>
    )
}

export default ConcertListing; 