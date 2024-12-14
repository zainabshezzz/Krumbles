import { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems,setcartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe'); // Default payment method is Stripe

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onPaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo['quantity'] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 200,
      paymentMethod: paymentMethod, // Include selected payment method
    };

    let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } });
    if (response.data.success) {
      if (paymentMethod === 'stripe') {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else if (paymentMethod === 'cod') {
        alert("Order placed successfully with Cash on Delivery");
        setcartItems({});
        navigate('/myorders'); // Navigate to a success page for COD
      }
    } else {
      alert("error");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, []);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone number' />
      </div>

      <div className="cart-total">
        <h2>Cart Total</h2>
        <div>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs. {getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs. {getTotalCartAmount() === 0 ? 0 : 200}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 200}</b>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="payment-method">
          <h3>Select Payment Method</h3>
          <label>
            <input
              type="radio"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={onPaymentMethodChange}
            />
            Stripe
          </label>
          <label>
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={onPaymentMethodChange}
            />
            Cash on Delivery (COD)
          </label>
        </div>

        <button type='submit' className='btn'>Proceed to Payment</button>
      </div>
    </form>
  );
}

export default PlaceOrder;
