import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from './App'; 

describe('ProfileScreen', () => {
  it('should navigate to AllEvents when the "Skelbimai" button is pressed', () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);
    
    // Mock navigation functions
    const mockNavigate = jest.fn();
    const mockNavigation = { navigate: mockNavigate };

    // Render the ProfileScreen component with the mocked navigation
    render(<ProfileScreen navigation={mockNavigation} />);
    
    // Find the "Skelbimai" button and press it
    const skelbimaiButton = getByText('Skelbimai');
    fireEvent.press(skelbimaiButton);
    
    // Check if the navigate function was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith('AllEvents');
  });

  // Add more test cases for other buttons if needed
});
