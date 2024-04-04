import React from 'react';
import './Login.css';
import { VscAccount } from "react-icons/vsc";
import background from "./imgs/concert-img.png"

const Login = () => {
    return (
        <div className="background" style={{ backgroundImage: `url(${background})`}}>
           <div className="Login"> 
            <div className="left-side">
                <div className="Welcome">
                Welcome to website name
                </div>
                <div style={{margin: 20,}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum viverra urna ac auctor gravida. Nullam cursus id odio sed varius. Morbi volutpat tortor dictum, rhoncus mi at, fermentum eros. 
                </div>
                
            </div>
            <div className="right-side">
                <VscAccount style={{height: 30, width: 30}}></VscAccount>
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
            </div>
        </div>
      </div>
    )
}      

export default Login;