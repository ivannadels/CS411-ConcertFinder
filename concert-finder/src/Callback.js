import React, {useEffect} from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

function Callback() {
    const location = useLocation();
    const history = useNavigate();
  
    useEffect(() => {
      const { code, error } = queryString.parse(location.search);
  
      if (error) {
        console.error('Error receiving authorization code:', error);
        history.push('/error'); // Redirect to an error page or handle error differently
        return;
      }
  
      if (code) {
        exchangeCodeForToken(code);
      }
    }, [location, history]);
  
    const exchangeCodeForToken = async (code) => {
      try {
        const response = await fetch('http://localhost:3000/Callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });
  
        if (!response.ok) {
          throw new Error('Failed to exchange code for token');
        }
  
        const data = await response.json();
        console.log('Access Token:', data.access_token);
        
      } catch (error) {
        console.error('Error:', error);
        
      }
    };

    return (
        <div>Loading...</div>
      );
}

export default Callback;