import YourPreferences from './YourPreferences.js';
import './App.css';
import Login from './Login.js';
import Header from './Header.js'
import './YourPreferences.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/YourPreferences" element={<YourPreferences />}></Route>
        <Route path="/Header" element={<Header />}></Route>
        </Routes>
      </Router>
      
         
    </div>
    
  );
}

export default App;
