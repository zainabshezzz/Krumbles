import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        Swal.fire({
          title: 'Success',
          text: currState === "Login" ? 'Login successful!' : 'Account created successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => setShowLogin(false));
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Server Error',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required />}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use and privacy policy</p>
        </div>
        {currState === 'Login' 
          ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click Here</span></p> 
          : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login Here</span></p>}
      </form>
    </div>
  );
};

export default LoginPopup;
