import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignIn } from '../SignIn';
import { useAuth } from 'contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mock the auth context
jest.mock('contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('SignIn Screen', () => {
  const mockSignIn = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      isLoading: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);

    expect(getByText('Welcome Back! ✨')).toBeTruthy();
    expect(getByText('Sign in to continue your journey')).toBeTruthy();
    expect(getByText('📧 Email Address')).toBeTruthy();
    expect(getByText('🔐 Password')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('🚀 Sign In')).toBeTruthy();
  });

  it('should show validation errors for empty fields', async () => {
    const { getByText } = render(<SignIn />);
    
    const signInButton = getByText('🚀 Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('your@email.com');
    fireEvent.changeText(emailInput, 'invalid-email');
    
    const signInButton = getByText('🚀 Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should show validation error for short password', async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(passwordInput, '123');
    
    const signInButton = getByText('🚀 Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('should call signIn with correct credentials', async () => {
    mockSignIn.mockResolvedValueOnce(true);
    
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signInButton = getByText('🚀 Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should handle sign in failure', async () => {
    mockSignIn.mockResolvedValueOnce(false);
    
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    
    const signInButton = getByText('🚀 Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      // The shake animation should be triggered on failure
    });
  });

  it('should handle sign in error', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Network error'));
    
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signInButton = getByText('🚀 Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Something went wrong. Please try again.');
    });
  });

  it('should show loading state when signing in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      isLoading: true,
    });

    const { getByText } = render(<SignIn />);
    
    expect(getByText('✨ Signing In...')).toBeTruthy();
  });

  it('should navigate to sign up when link is pressed', () => {
    const { getByText } = render(<SignIn />);
    
    const signUpLink = getByText('Sign Up');
    fireEvent.press(signUpLink);

    expect(mockPush).toHaveBeenCalledWith('/auth/signup');
  });

  it('should disable button when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      isLoading: true,
    });

    const { getByText } = render(<SignIn />);
    
    const signInButton = getByText('✨ Signing In...');
    expect(signInButton.props.disabled).toBeTruthy();
  });
});