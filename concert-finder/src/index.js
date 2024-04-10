import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'; // Use BrowserRouter for most cases
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    
    <React.StrictMode>
    <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
