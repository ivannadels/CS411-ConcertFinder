import React from 'react';
import './SavedLists.css';

const SavedLists = (props) => {
    return (
        <div className='Concerts'>
            <div className='EventInfo'>
                <span style={{gridColumn: '1'}}>{props.artistName}</span>
                <span style={{gridColumn: '2'}}>{props.location}</span>
                <span style={{gridColumn: '3'}}>{props.city}</span>
                <span style={{gridColumn: '4'}}>{props.state}</span>
                <span style={{gridColumn: '5'}}>{props.datetime}</span>
            </div>
           
            <div className='Delete'>
                <button className='delete-button'>
                <img src="/delete-icon.png"></img>
                </button>
            </div>
        </div>  
    )
}

export default SavedLists; 