import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'


const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logowhite} alt="" />
            <p>Started as a small project in a MCS dorm room, Krumble's first location featured just a countertop display, serving as our humble beginning.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Get in Touch</h2>
            <ul>
                <li>00289200101</li>
                <li>contact@krumble.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">&copy; 2024 P4L <br />All Rights Reserved</p>
    </div>
  )
}

export default Footer
