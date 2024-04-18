import React from 'react';
import './ConcertListing.css';

const ConcertListing = (props) => {
    return (
        <div className='Listing'>
            <div className='concertInfo'>
                <span style={{gridColumn: '1'}}>{props.artistName}</span>
                <span style={{gridColumn: '2'}}>{props.location}</span>
                <span style={{gridColumn: '3'}}>{props.city}</span>
                <span style={{gridColumn: '4'}}>{props.time}</span>
            </div>
            <div className='tickets'>
                <button className='button'>
                    Go to tickets
                </button>
            </div>
            <div className='saveConcert'>
                <button className='button'>
                    Save Concert
                </button>
            </div>
        </div>
        
    )
}

export default ConcertListing; 