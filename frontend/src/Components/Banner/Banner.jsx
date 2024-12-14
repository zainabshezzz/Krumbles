import React from 'react'
import './Banner.css'
import truck from '../../assets/truck.png'

const Banner = () => {
  return (
    
<div className="banner">
  <p className="banner-text">Next-day shipping <img src={truck} className='icon'></img>| Delivery in 3-7 days | No Sunday dispatches - plan accordingly!</p>
  <p className="banner-text">Next-day shipping <img src={truck} className='icon'></img> | Delivery in 3-7 days | No Sunday dispatches - plan accordingly!</p>
  <p className="banner-text">Next-day shipping <img src={truck} className='icon'></img> | Delivery in 3-7 days | No Sunday dispatches - plan accordingly!</p>
  <p className="banner-text">Next-day shipping <img src={truck} className='icon'></img> | Delivery in 3-7 days | No Sunday dispatches - plan accordingly!</p>
</div>


  )
}

export default Banner
