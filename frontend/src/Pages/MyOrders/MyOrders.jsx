import React, { useEffect, useState } from 'react'
import './MyOrders.css'
import { useContext } from 'react';
import {StoreContext} from '../../Context/StoreContext'
import axios from 'axios';
import {assets} from '../../assets/assets'

const MyOrders = () => {
    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
            const reversedData = response.data.data.reverse(); // Reverse the order of the data
            setData(reversedData); // Set the reversed data to state
            console.log(reversedData); // Log the reversed data
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    

    useEffect(()=>{
        if (token) {
            fetchOrders();           
        }
    },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders:</h2>
      <div className="container">
        {data.map((order,index)=>{
            return (
                <div key={index} className="my-orders-order">
                    <img src={assets.parcel_icon} alt="" />
                    <p>{order.items.map((item,index)=>{
                        if (index===order.items.length-1) {
                            return item.name+' x '+item.quantity
                        }
                        else{
                            return item.name+' x '+item.quantity+ " ,"
                        }
                    })}</p>
                    <p>Rs. {order.amount}.00</p>
                    <p>Items: {order.items.length}</p>
                    <p><span>&#x25cf;</span><b>{order.status}</b></p>
                    <button onClick={fetchOrders}>Track Order</button>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default MyOrders
