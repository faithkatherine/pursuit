import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useRef } from "react";
import { ShakeAnimatedView, ShakeAnimatedViewRef } from "components/Animations";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import colors from "themes/tokens/colors";
import { Button } from "components/Buttons";
import { BaseModal as Modal } from "components/Modals";
import { EmojiPicker } from "components/Pickers";
import {
  ADD_BUCKET_ITEM,
  GET_BUCKET_CATEGORIES,
} from "graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import { GetBucketCategoriesQuery } from "graphql/types";

interface FormData {
  itemName: string;
  description: string;
  amount?: number;
  image?: string;
  categoryId?: string;
  newCategoryName?: string;
  newCategoryEmoji?: string;
}

interface AddBucketItemProps {
  visible: boolean;
  onClose: () => void;
}

export const AddBucketItem = ({ visible, onClose }: AddBucketItemProps) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      itemName: "",
      description: "",
      amount: undefined,
      image: "",
      categoryId: "",
      newCategoryName: "",
      newCategoryEmoji: "",
    },
  });

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shakeViewRef = useRef<ShakeAnimatedViewRef>(null);

  const {
    loading: categoriesLoading,
    data: categoriesData,
    error: categoriesError,
  } = useQuery<GetBucketCategoriesQuery>(GET_BUCKET_CATEGORIES);
  const [addBucketItem, { loading: addItemLoading }] = useMutation(
    ADD_BUCKET_ITEM
  );

  const bucketCategories = categoriesData?.getBucketCategories || [];

  if (categoriesError) {
    console.error("Error loading categories:", categoriesError);
  }

  const shakeError = () => {
    shakeViewRef.current?.shake();
  };

  const onSubmit = async (data: FormData) => {
    // Validate category selection
    if (!showNewCategoryForm && !data.categoryId) {
      alert("Please select a category or create a new one");
      shakeError();
      return;
    }
    
    if (showNewCategoryForm && (!data.newCategoryName || !data.newCategoryEmoji)) {
      alert("Please provide both category name and emoji");
      shakeError();
      return;
    }

    setIsSubmitting(true);

    try {
      await addBucketItem({
        variables: {
          title: data.itemName,
          description: data.description || null,
          amount: data.amount || null,
          image: selectedImage || null,
          categoryId: data.categoryId || null,
          newCategoryName: data.newCategoryName || null,
          newCategoryEmoji: data.newCategoryEmoji || null,
        },
      });

      // Show success toast
      Alert.alert(
        "🎉 Success!", 
        "Your bucket list item has been added successfully!",
        [
          {
            text: "Great!",
            onPress: () => {
              handleClose();
              router.push("/(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adding bucket item:", error);
      
      // Show error alert with retry option
      Alert.alert(
        "❌ Oops!", 
        "Something went wrong while adding your bucket list item. Would you like to try again?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              handleClose();
              router.push("/(tabs)");
            },
          },
          {
            text: "Retry",
            onPress: () => onSubmit(data),
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    shakeError();
  };

  const handleClose = () => {
    reset();
    setSelectedEmoji("");
    setSelectedImage("");
    setShowNewCategoryForm(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleCreateNewCategory = () => {
    setShowNewCategoryForm(true);
    setValue("categoryId", "");
  };

  const handleSelectExistingCategory = () => {
    setShowNewCategoryForm(false);
    setSelectedEmoji("");
    setValue("newCategoryName", "");
    setValue("newCategoryEmoji", "");
  };

  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose how you'd like to add an image",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Photo Library",
          onPress: () => openImageLibrary(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      setValue("image", imageUri);
    }
  };

  const openImageLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access photo library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      setValue("image", imageUri);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      variant="fullScreen"
      onClose={handleClose}
    >
      <ShakeAnimatedView ref={shakeViewRef} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>✨ Add to Your Bucket List ✨</Text>
          <Text style={styles.subtitle}>What's your next adventure?</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Controller
            control={control}
            name="itemName"
            rules={{
              required: "Item name is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>🎯 What's Your Goal?</Text>
                <TextInput
                  style={[styles.input, errors.itemName && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Learn to surf in Bali"
                  placeholderTextColor={colors.aluminium}
                />
                {errors.itemName && (
                  <Text style={styles.error}>
                    ✋ Tell us about your adventure!
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>📝 Dream Details (Optional)</Text>
                <TextInput
                  style={[styles.textArea]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Take surfing lessons at Uluwatu Beach, watch the sunset, and celebrate with local food..."
                  placeholderTextColor={colors.aluminium}
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>💰 Estimated Amount (Optional)</Text>
                <TextInput
                  style={[styles.input]}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const numericValue = text ? parseFloat(text) : undefined;
                    onChange(numericValue);
                  }}
                  value={value ? value.toString() : ""}
                  placeholder="2500"
                  placeholderTextColor={colors.aluminium}
                  keyboardType="numeric"
                />
              </View>
            )}
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>🖼️ Add an Inspiring Image</Text>
            <Button
              text={selectedImage ? "✅ Image Selected" : "📷 Choose Image"}
              variant="secondary"
              onPress={pickImage}
              style={[
                styles.imagePickerButton,
                selectedImage && styles.imageSelectedButton
              ]}
            />
            {selectedImage && (
              <Text style={styles.imagePreviewText}>
                🎨 Image selected! Ready to add to your bucket list.
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>📂 Choose Category</Text>
            <View style={styles.categoryToggle}>
              <Button
                text="Existing Category"
                variant="secondary"
                onPress={handleSelectExistingCategory}
                style={[
                  styles.toggleButton,
                  !showNewCategoryForm && styles.toggleButtonActive,
                ]}
              />
              <Button
                text="Create New"
                variant="secondary"
                onPress={handleCreateNewCategory}
                style={[
                  styles.toggleButton,
                  showNewCategoryForm && styles.toggleButtonActive,
                ]}
              />
            </View>
          </View>

          {!showNewCategoryForm ? (
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <View style={styles.fieldContainer}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={value || ""}
                        onValueChange={(itemValue) => {
                          onChange(itemValue);
                        }}
                        onBlur={onBlur}
                        style={[
                          styles.picker,
                          Platform.OS === "ios" ? { marginTop: -70 } : {},
                        ]}
                        itemStyle={{
                          fontSize: 16,
                          height: 250,
                          color: colors.thunder,
                        }}
                        mode="dropdown"
                        dropdownIconColor={colors.thunder}
                        dropdownIconRippleColor={colors.prim}
                      >
                        <Picker.Item
                          label="-- Select a category --"
                          value=""
                          style={{ color: colors.aluminium }}
                        />
                        {bucketCategories.map((category) => (
                          <Picker.Item
                            key={category.id}
                            label={`${category.emoji} ${category.name}`}
                            value={category.id}
                            style={{ color: colors.thunder }}
                          />
                        ))}
                      </Picker>
                    </View>
                    {!categoriesLoading &&
                      !categoriesError &&
                      bucketCategories.length === 0 && (
                        <Text style={styles.noCategoriesText}>
                          No categories found. Create a new category instead.
                        </Text>
                      )}
                  </View>
                );
              }}
            />
          ) : (
            <>
              <Controller
                control={control}
                name="newCategoryName"
                rules={
                  showNewCategoryForm
                    ? { required: "Category name is required" }
                    : {}
                }
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>🏷️ New Category Name</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.newCategoryName && styles.inputError,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Adventure Sports"
                      placeholderTextColor={colors.aluminium}
                    />
                    {errors.newCategoryName && (
                      <Text style={styles.error}>
                        ✋ What should we call this category?
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="newCategoryEmoji"
                rules={
                  showNewCategoryForm
                    ? { required: "Please select an emoji" }
                    : {}
                }
                render={() => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>🎭 Category Emoji</Text>
                    {errors.newCategoryEmoji && (
                      <Text style={styles.error}>
                        🎯 Pick an emoji for your category!
                      </Text>
                    )}
                    <EmojiPicker
                      selectedEmoji={selectedEmoji}
                      onEmojiSelect={(emoji) => {
                        setSelectedEmoji(emoji);
                        setValue("newCategoryEmoji", emoji);
                      }}
                    />
                  </View>
                )}
              />
            </>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            text={isSubmitting || addItemLoading ? "✨ Adding..." : "🚀 Add to Bucket List!"}
            variant="primary"
            onPress={handleSubmit(onSubmit, onError)}
            disabled={isSubmitting || addItemLoading}
            style={styles.addButton}
          />
        </View>
      </ShakeAnimatedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.thunder,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.leather,
    textAlign: "center",
    fontStyle: "italic",
  },

  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.thunder,
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.silverSand,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textArea: {
    borderWidth: 2,
    borderColor: colors.silverSand,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.shilo,
    borderWidth: 2,
  },
  error: {
    color: colors.shilo,
    fontSize: 15,
    marginTop: 8,
    fontWeight: "500",
  },
  categoryToggle: {
    flexDirection: "row",
    backgroundColor: colors.prim,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: colors.deluge,
  },

  pickerContainer: {
    borderWidth: 2,
    borderColor: colors.silverSand,
    borderRadius: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
    justifyContent: "flex-start",
  },
  picker: {
    width: "100%",
    backgroundColor: colors.white,
    color: colors.thunder,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.thunder,
  },
  pickerItem: {
    fontSize: 16,
    color: colors.thunder,
  },
  noCategoriesText: {
    fontSize: 14,
    color: colors.aluminium,
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.thunder,
    textAlign: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.shilo,
    textAlign: "center",
    padding: 16,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: "center",
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: colors.deluge,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 4,
    shadowColor: colors.deluge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: colors.silverSand,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  imageSelectedButton: {
    borderColor: colors.deluge,
    backgroundColor: colors.deluge + "10", // Light tint
  },
  imagePreviewText: {
    fontSize: 14,
    color: colors.deluge,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
  },
});
