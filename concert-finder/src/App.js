import './App.css';
import Login from './Login.js';
import YourPreferences from './YourPreferences.js';
import ConcertsNearby from './ConcertsNearby.js';
import SavedConcerts from './SavedConcerts.js';
import Callback from './Callback.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Callback" element={<Callback/>}></Route>
        <Route path="/YourPreferences" element={<YourPreferences />}></Route>
        <Route path="/ConcertsNearby" element={<ConcertsNearby />}></Route>
        <Route path="/SavedConcerts" element={<SavedConcerts />}></Route>
        
        </Routes>
      </Router>
      
         
    </div>
    
  );
}

export default App;
