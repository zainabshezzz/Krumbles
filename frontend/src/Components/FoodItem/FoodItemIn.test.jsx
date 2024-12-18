import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from './FoodItem';
import Cart from '../../Pages/Cart/Cart'; // Assuming Cart is in the correct directory
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// Mock data for a food item
const mockFoodItem = {
  id: 1,
  name: 'Cookie A',
  price: 5,
  description: 'Delicious chocolate chip cookie',
  image: '/cookieA.jpg',
};

// Mock context provider
const MockStoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({ [mockFoodItem.id]: 1 }); // Initially one item in the cart

  const addToCart = jest.fn();
  const removeFromCart = jest.fn((id) => {
    setCartItems((prevItems) => {
      const newQuantity = Math.max(0, (prevItems[id] || 0) - 1);
      return { ...prevItems, [id]: newQuantity };
    });
  });

  const getTotalCartAmount = jest.fn(() => cartItems[mockFoodItem.id] * mockFoodItem.price);

  return (
    <StoreContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalCartAmount, food_list: [mockFoodItem], url: 'http://localhost', token: null }}>
      {children}
    </StoreContext.Provider>
  );
};

describe('Integration Test: FoodItem and Cart', () => {
  it('decreases the quantity of the item in the cart when removeFromCart is pressed', () => {
    render(
      <MemoryRouter>
        <MockStoreProvider>
          <FoodItem 
            id={mockFoodItem.id} 
            name={mockFoodItem.name} 
            price={mockFoodItem.price} 
            description={mockFoodItem.description} 
            image={mockFoodItem.image} 
          />
          <Cart />
        </MockStoreProvider>
      </MemoryRouter>
    );

    // Check initial quantity in the cart
    expect(screen.getByText('1')).toBeInTheDocument(); // Quantity should be 1

    // Click the remove button
    fireEvent.click(screen.getByAltText('x')); // Assuming 'x' is the remove button

    // Check if the quantity in the cart has decreased
    expect(screen.queryByText('1')).not.toBeInTheDocument(); // Quantity should not be displayed anymore
  });
});