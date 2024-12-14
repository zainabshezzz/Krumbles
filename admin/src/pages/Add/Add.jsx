import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import Swal from 'sweetalert2';

const Add = ({ url }) => {
  const [image, setImage] = useState(null); // saves image
  const [data, setData] = useState({ // saves rest of data
    name: "",
    description: "",
    price: "",
    category: "Cookies"
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateInputs = () => {
    if (!data.name.trim()) {
      Swal.fire('Error', 'Product name is required', 'error');
      return false;
    }
    if (!data.description.trim()) {
      Swal.fire('Error', 'Product description is required', 'error');
      return false;
    }
    if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
      Swal.fire('Error', 'Please enter a valid positive price', 'error');
      return false;
    }
    if (!image) {
      Swal.fire('Error', 'Please upload an image of the product', 'error');
      return false;
    }
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(image.type)) {
      Swal.fire('Error', 'Only PNG, JPG, and JPEG images are allowed', 'error');
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateInputs()) return;
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);
    
    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Cookies"
        });
        setImage(null);
        Swal.fire('Success', response.data.message, 'success');
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Server error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className='add'>
      <form className='flex-column' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload preview" />
          </label>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id="image" 
            hidden 
            accept="image/png, image/jpeg, image/jpg" 
            required 
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Type here' 
            required 
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows='6' 
            placeholder='Write content here' 
            required 
          />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select 
              onChange={onChangeHandler} 
              value={data.category} 
              name="category"
            >
              <option value="Cookies">Cookies</option>
              <option value="Assorted Boxes">Assorted Boxes</option>
              <option value="Soft Serve">Soft Serve</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" 
              name='price' 
              placeholder='Rs. 310' 
              min="1" 
              required 
            />
          </div>
        </div>
        <button type='submit' className='add-btn'>Add</button>
      </form>
    </div>
  );
};

export default Add;
