import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExploreMenu from './ExploreMenu';

// Mock data for menu_list
const mockMenuList = [
  {
    menu_name: 'Cookies',
    menu_image: 'Cookies.jpg',
  },
  {
    menu_name: 'Assorted Boxes',
    menu_image: 'Assorted_Boxes.jpg',
  },
  {
    menu_name: 'SoftServe',
    menu_image: 'SoftServe.jpg',
  },
];

describe('ExploreMenu Component', () => {
  it('renders the heading', () => {
    render(<ExploreMenu category="All" setCategory={jest.fn()} />);

    // Check if the heading text is rendered correctly
    expect(screen.getByText('Explore Our Menu')).toBeInTheDocument();
  });

  it('displays menu items based on the menu_list prop', () => {
    render(<ExploreMenu category="All" setCategory={jest.fn()} menu_list={mockMenuList} />);

    // Check if all menu items are rendered
    mockMenuList.forEach(item => {
      expect(screen.getByText(item.menu_name)).toBeInTheDocument();
      expect(screen.getByAltText(item.menu_name)).toBeInTheDocument(); // Check for alt text
    });
  });

  it('changes category when a menu item is clicked', () => {
    const setCategoryMock = jest.fn();
    render(<ExploreMenu category="All" setCategory={setCategoryMock} menu_list={mockMenuList} />);

    // Click on the first menu item
    const firstMenuItem = screen.getByText(mockMenuList[0].menu_name);
    fireEvent.click(firstMenuItem);

    // Check if setCategory was called with a function
    expect(setCategoryMock).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the function call and check if it changes the category to 'Cookies'
    setCategoryMock.mock.calls[0][0]('All');  // Call the function with the current category
    expect(setCategoryMock.mock.calls[0][0]('All')).toBe('Cookies');
  });

  it('toggles category to "All" when the same item is clicked again', () => {
    const setCategoryMock = jest.fn();
    render(<ExploreMenu category="Cookies" setCategory={setCategoryMock} menu_list={mockMenuList} />);

    // Click on the same menu item (Cookies)
    const firstMenuItem = screen.getByText(mockMenuList[0].menu_name);
    fireEvent.click(firstMenuItem);

    // Check if setCategory was called with a function
    expect(setCategoryMock).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the function call and check if it changes the category to 'All'
    setCategoryMock.mock.calls[0][0]('Cookies');  // Call the function with the current category
    expect(setCategoryMock.mock.calls[0][0]('Cookies')).toBe('All');
  });
});
