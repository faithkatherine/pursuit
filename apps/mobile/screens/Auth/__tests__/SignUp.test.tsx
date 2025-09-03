import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUp } from '../SignUp';
import { useAuth } from 'pursuit/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mock the auth context
jest.mock('pursuit/contexts/AuthContext', () => ({
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

describe('SignUp Screen', () => {
  const mockSignUp = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isLoading: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);

    expect(getByText('Join the Adventure! 🌟')).toBeTruthy();
    expect(getByText('Create your account to start tracking your bucket list')).toBeTruthy();
    expect(getByText('👤 Full Name')).toBeTruthy();
    expect(getByText('📧 Email Address')).toBeTruthy();
    expect(getByText('🔐 Password')).toBeTruthy();
    expect(getByText('🔒 Confirm Password')).toBeTruthy();
    expect(getByPlaceholderText('Your full name')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Create a strong password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
    expect(getByText('🚀 Sign Up')).toBeTruthy();
  });

  it('should show validation errors for empty fields', async () => {
    const { getByText } = render(<SignUp />);
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
      expect(getByText('Please confirm your password')).toBeTruthy();
    });
  });

  it('should show validation error for short name', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const nameInput = getByPlaceholderText('Your full name');
    fireEvent.changeText(nameInput, 'A');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Name must be at least 2 characters')).toBeTruthy();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const emailInput = getByPlaceholderText('your@email.com');
    fireEvent.changeText(emailInput, 'invalid-email');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should show validation error for short password', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const passwordInput = getByPlaceholderText('Create a strong password');
    fireEvent.changeText(passwordInput, '123');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('should show validation error for mismatched passwords', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const passwordInput = getByPlaceholderText('Create a strong password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password456');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('should call signUp with correct data', async () => {
    mockSignUp.mockResolvedValueOnce(true);
    
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const nameInput = getByPlaceholderText('Your full name');
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('Create a strong password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
    });
  });

  it('should handle sign up failure', async () => {
    mockSignUp.mockResolvedValueOnce(false);
    
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const nameInput = getByPlaceholderText('Your full name');
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('Create a strong password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      // The shake animation should be triggered on failure
    });
  });

  it('should handle sign up error', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Network error'));
    
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    const nameInput = getByPlaceholderText('Your full name');
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('Create a strong password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    const signUpButton = getByText('🚀 Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Something went wrong. Please try again.');
    });
  });

  it('should show loading state when signing up', () => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isLoading: true,
    });

    const { getByText } = render(<SignUp />);
    
    expect(getByText('✨ Creating Account...')).toBeTruthy();
  });

  it('should navigate to sign in when link is pressed', () => {
    const { getByText } = render(<SignUp />);
    
    const signInLink = getByText('Sign In');
    fireEvent.press(signInLink);

    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  it('should disable button when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isLoading: true,
    });

    const { getByText } = render(<SignUp />);
    
    const signUpButton = getByText('✨ Creating Account...');
    expect(signUpButton.props.disabled).toBeTruthy();
  });
});