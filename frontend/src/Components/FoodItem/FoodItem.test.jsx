import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from './FoodItem';

// Mock data for a food item
const mockFoodItem = {
  id: 1,
  name: 'Cookie A',
  price: 5,
  description: 'Delicious chocolate chip cookie',
  image: '/cookieA.jpg',
};

describe('FoodItem Component', () => {

  it('renders the food item correctly', () => {
    // Mock context values
    const mockContext = {
      cartItems: {},
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      url: 'http://localhost', // mock url for images
    };

    render(
      <StoreContext.Provider value={mockContext}>
        <FoodItem 
          id={mockFoodItem.id} 
          name={mockFoodItem.name} 
          price={mockFoodItem.price} 
          description={mockFoodItem.description} 
          image={mockFoodItem.image} 
        />
      </StoreContext.Provider>
    );

    // Check if the food item's name, description, and price are rendered correctly
    expect(screen.getByText('Cookie A')).toBeInTheDocument();
    expect(screen.getByText('Delicious chocolate chip cookie')).toBeInTheDocument();
    expect(screen.getByText('Rs. 5')).toBeInTheDocument();
  });

});
