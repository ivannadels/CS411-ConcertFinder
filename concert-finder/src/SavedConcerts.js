import React from 'react';
import Header from './Header.js';
import './SavedConcerts.css';

const SavedConcerts = () => {
    return (
        <div className='SavedConcerts'>
            <Header></Header>
            <div className='title'>Your Saved Concerts</div>
        </div>
    )
}

export default SavedConcerts