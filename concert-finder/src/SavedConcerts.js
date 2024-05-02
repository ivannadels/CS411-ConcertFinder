// import React, { useEffect, useState } from 'react';
// import Header from './Header';
// import './SavedConcerts.css';
// import { getSavedConcerts, removeConcert } from './apiServices'; // Adjust the path as needed

// const SavedConcerts = () => {
//     const [concerts, setConcerts] = useState([]);
//     //const [location, setLocation] = useState('Boston');
//     // Fetch concerts on component mount
//     useEffect(() => {
//         const fetchConcerts = async () => {
//             try {
//                 const data = await getSavedConcerts();
//                 setConcerts(data);
//             } catch (error) {
//                 console.error('Error fetching saved concerts:', error);
                
//             }
//         };

//         fetchConcerts();
//     }, []);

//     // Handle concert removal
//     const handleRemove = async (id) => {
//         try {
//             await removeConcert(id);
//             // Filter out the removed concert without needing to refetch from the server
//             setConcerts(concerts.filter(concert => concert._id !== id));
//         } catch (error) {
//             console.error('Error removing concert:', error);
            
//         }
//     };

//     return (
//         <div className='SavedConcerts'>
//             <Header />
//             <h2>Your Saved Concerts</h2>
//             <ul>
//                 {concerts.length > 0 ? (
//                     concerts.map(concert => (
//                         <li key={concert._id}>
//                             {concert.artist} at {concert.venue} - {new Date(concert.date).toLocaleDateString()}
//                             <button onClick={() => handleRemove(concert._id)}>Remove</button>
//                         </li>
//                     ))
//                 ) : (
//                     <p>No saved concerts to display.</p>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default SavedConcerts;
import React, { useEffect, useState } from 'react';
import Header from './Header';
import './SavedConcerts.css';
import { getSavedConcerts, removeConcert } from './apiServices'; // Adjust the path as needed

const SavedConcerts = () => {
    const [concerts, setConcerts] = useState([]);

    // Fetch concerts on component mount
    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const data = await getSavedConcerts();
                setConcerts(data);
            } catch (error) {
                console.error('Error fetching saved concerts:', error);
            }
        };

        fetchConcerts();
    }, []);

    // Handle concert removal
    const handleRemove = async (id) => {
        try {
            await removeConcert(id);
            // Filter out the removed concert without needing to refetch from the server
            setConcerts(concerts.filter(concert => concert._id !== id));
        } catch (error) {
            console.error('Error removing concert:', error);
        }
    };

    return (
        <div className='SavedConcerts'>
            <Header />
            <h2>Your Saved Concerts</h2>
            <ul>
                {concerts.length > 0 ? (
                    concerts.map(concert => (
                        <li key={concert._id}>
                            {concert.artist} at {concert.venue} - {new Date(concert.date).toLocaleDateString()}
                            <button onClick={() => handleRemove(concert._id)}>Remove</button>
                        </li>
                    ))
                ) : (
                    <p>No saved concerts to display.</p>
                )}
            </ul>
        </div>
    );
};

export default SavedConcerts;
