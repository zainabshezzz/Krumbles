import React from 'react'
import './Orders.css'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'
import {assets} from '../../assets/assets'

const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url+'/api/order/list')
    const reversedData = response.data.data.reverse(); // Reverse the order of the data
    if (response.data.success) {
            setOrders(reversedData); // Set the reversed data to state
            console.log(reversedData); // Log the reversed data
    }
    else{
      toast.error("Error");
    }
  }

  const statusHandler = async (event,orderId) => {
    const response = await axios.post(url+'/api/order/status',{
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
    
  }

  useEffect(()=>{
    fetchAllOrders();
  },[url]) // adding url as a dependency

  return (
    <div className='order add'>
      <h3>Order Page:</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, itemIndex) => (
                  <span key={itemIndex}>
                    {item.name} x {item.quantity}
                    {itemIndex !== order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className='order-item-name'>{order.address.firstName+" "+order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street+','}</p>
                <p>{order.address.city+', '+order.address.state+' ,'+order.address.country+' ,'+order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>Rs. {order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Item Processing">Item Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;
