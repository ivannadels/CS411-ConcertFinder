import React from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import background from "./imgs/concert-img.png"
import './YourPreferences.js'

const Login = () => {

  const navigate = useNavigate();
  const gotToMain=()=>{
    navigate("/ConcertsNearby");
  };
    return (
        <div className="background" style={{ backgroundImage: `url(${background})`}}>
           <div className="Login"> 
            <div className="left-side">
                <div className="Welcome">
                Welcome to <span className='app-name'>Concert Compass</span>
                </div>
                <div style={{margin: 20}}>
                    Concert Compass is an online destination dedicated to helping you discover nearby concerts featuring your favorite artists.  
                </div>
                
            </div>
            <div className="right-side">
                <VscAccount 
                    style={{
                        height: 30, 
                        width: 30, 
                        color: '#f1ee8e'}}>
                    </VscAccount>
                <div className="UserLogin">
                    User Login
                </div>
                <input
                    id="username"
                    className="login-info"
                    type="text"
                    placeholder='Username'
                >
                </input>
                <input
                    id="password"
                    className="login-info"
                    type="text"
                    placeholder='Password'
                >
                </input>

                <button 
                onClick={()=>gotToMain()} 
                className="Button" 
                id="loginButton">
                Login
                </button>
            </div>
        </div>
      </div>
    );
}      

export default Login;