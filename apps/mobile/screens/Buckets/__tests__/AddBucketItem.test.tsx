import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddBucketItem } from '../AddBucketItem';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock EmojiPicker
jest.mock('pursuit/components/Pickers/EmojiPicker', () => ({
  EmojiPicker: ({ onEmojiSelect }: any) => (
    <button testID="emoji-picker" onClick={() => onEmojiSelect('🎯')}>
      Pick Emoji
    </button>
  ),
}));

// Mock BaseModal
jest.mock('pursuit/components/Modals/BaseModal.tsx', () => ({
  BaseModal: ({ children, visible, onClose }: any) =>
    visible ? <div testID="modal" onClick={onClose}>{children}</div> : null,
}));

// Mock Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('AddBucketItem Screen', () => {
  const mockPush = jest.fn();
  const mockAddBucketItem = jest.fn();
  const mockOnClose = jest.fn();

  const mockCategories = [
    { id: '1', name: 'Travel', emoji: '✈️' },
    { id: '2', name: 'Food', emoji: '🍕' },
    { id: '3', name: 'Adventure', emoji: '🏔️' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getBucketCategories: mockCategories },
      error: null,
    });

    (useMutation as jest.Mock).mockReturnValue([
      mockAddBucketItem,
      { loading: false }
    ]);
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    expect(getByText('✨ Add to Your Bucket List ✨')).toBeTruthy();
    expect(getByText('🎯 What\'s Your Goal?')).toBeTruthy();
    expect(getByText('📝 Dream Details (Optional)')).toBeTruthy();
    expect(getByText('💰 Estimated Amount (Optional)')).toBeTruthy();
    expect(getByText('🖼️ Add an Inspiring Image')).toBeTruthy();
    expect(getByText('📂 Choose Category')).toBeTruthy();
    expect(getByPlaceholderText('Learn to surf in Bali')).toBeTruthy();
    expect(getByPlaceholderText('2500')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByTestId } = render(
      <AddBucketItem visible={false} onClose={mockOnClose} />
    );

    expect(queryByTestId('modal')).toBeNull();
  });

  it('should show validation errors for required fields', async () => {
    const { getByText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    const submitButton = getByText('🚀 Add to Bucket List!');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('✋ Tell us about your adventure!')).toBeTruthy();
    });
  });

  it('should handle form submission with valid data', async () => {
    mockAddBucketItem.mockResolvedValueOnce({ data: { addBucketItem: { id: '1' } } });

    const { getByText, getByPlaceholderText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    // Fill in the form
    const titleInput = getByPlaceholderText('Learn to surf in Bali');
    const descriptionInput = getByPlaceholderText(/Take surfing lessons/);
    const amountInput = getByPlaceholderText('2500');

    fireEvent.changeText(titleInput, 'Learn to surf');
    fireEvent.changeText(descriptionInput, 'Take surfing lessons at Bondi Beach');
    fireEvent.changeText(amountInput, '350');

    // Select a category
    const existingCategoryButton = getByText('Existing Category');
    fireEvent.press(existingCategoryButton);

    const submitButton = getByText('🚀 Add to Bucket List!');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockAddBucketItem).toHaveBeenCalledWith({
        variables: {
          title: 'Learn to surf',
          description: 'Take surfing lessons at Bondi Beach',
          amount: 350,
          image: null,
          categoryId: null,
          newCategoryName: null,
          newCategoryEmoji: null,
        },
      });
    });
  });

  it('should show success alert on successful submission', async () => {
    mockAddBucketItem.mockResolvedValueOnce({ data: { addBucketItem: { id: '1' } } });

    const { getByText, getByPlaceholderText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    const titleInput = getByPlaceholderText('Learn to surf in Bali');
    fireEvent.changeText(titleInput, 'Learn to surf');

    const submitButton = getByText('🚀 Add to Bucket List!');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '🎉 Success!',
        'Your bucket list item has been added successfully!',
        expect.arrayContaining([
          expect.objectContaining({
            text: 'Great!',
            onPress: expect.any(Function),
          }),
        ])
      );
    });
  });

  it('should show error alert on submission failure', async () => {
    mockAddBucketItem.mockRejectedValueOnce(new Error('Network error'));

    const { getByText, getByPlaceholderText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    const titleInput = getByPlaceholderText('Learn to surf in Bali');
    fireEvent.changeText(titleInput, 'Learn to surf');

    const submitButton = getByText('🚀 Add to Bucket List!');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '❌ Oops!',
        'Something went wrong while adding your bucket list item. Would you like to try again?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
          expect.objectContaining({ text: 'Retry' }),
        ])
      );
    });
  });

  it('should handle image picker', async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: 'test-image-uri.jpg' }],
    };

    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock)
      .mockResolvedValueOnce({ granted: true });
    (ImagePicker.launchImageLibraryAsync as jest.Mock)
      .mockResolvedValueOnce(mockImageResult);

    const { getByText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    const imageButton = getByText('📷 Choose Image');
    fireEvent.press(imageButton);

    // Simulate selecting "Photo Library" from alert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Select Image',
      'Choose how you\'d like to add an image',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Photo Library' }),
        expect.objectContaining({ text: 'Camera' }),
        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
      ]),
      { cancelable: true }
    );
  });

  it('should handle new category creation', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    // Switch to create new category
    const createNewButton = getByText('Create New');
    fireEvent.press(createNewButton);

    // Fill in new category details
    const categoryNameInput = getByPlaceholderText('Adventure Sports');
    fireEvent.changeText(categoryNameInput, 'Water Sports');

    // Select emoji
    const emojiPicker = getByTestId('emoji-picker');
    fireEvent.press(emojiPicker);

    // Fill in item details
    const titleInput = getByPlaceholderText('Learn to surf in Bali');
    fireEvent.changeText(titleInput, 'Learn to surf');

    mockAddBucketItem.mockResolvedValueOnce({ data: { addBucketItem: { id: '1' } } });

    const submitButton = getByText('🚀 Add to Bucket List!');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockAddBucketItem).toHaveBeenCalledWith({
        variables: {
          title: 'Learn to surf',
          description: null,
          amount: null,
          image: null,
          categoryId: null,
          newCategoryName: 'Water Sports',
          newCategoryEmoji: '🎯',
        },
      });
    });
  });

  it('should show loading state while submitting', () => {
    (useMutation as jest.Mock).mockReturnValue([
      mockAddBucketItem,
      { loading: true }
    ]);

    const { getByText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    expect(getByText('✨ Adding...')).toBeTruthy();
  });

  it('should close modal when close is called', () => {
    const { getByTestId } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    const modal = getByTestId('modal');
    fireEvent.press(modal);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle categories loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      data: null,
      error: null,
    });

    const { getByText } = render(
      <AddBucketItem visible={true} onClose={mockOnClose} />
    );

    // Form should still render even when categories are loading
    expect(getByText('✨ Add to Your Bucket List ✨')).toBeTruthy();
  });

  it('should handle categories error state', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: null,
      error: new Error('Failed to load categories'),
    });

    render(<AddBucketItem visible={true} onClose={mockOnClose} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading categories:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});