import React from 'react';
import Header from './Header';
import './ConcertsNearby.css';
import ConcertListing from './ConcertListing';

const ConcertsNearby = () => {
    return (
        <div className='concertsNearby'>
            <Header></Header>
            <div className='title'>Concerts Near You</div>
            <ConcertListing
                artistName='Melanie Martinez'
                location='TD Garden'
                city='Boston'
                time="4pm"
            > 
            </ConcertListing>
        </div>
    )
}

export default ConcertsNearby