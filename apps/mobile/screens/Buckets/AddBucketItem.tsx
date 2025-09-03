import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useRef } from "react";
import colors from "pursuit/themes/tokens/colors";
import { Button } from "pursuit/components/Buttons/Buttons";
import { BaseModal as Modal } from "pursuit/components/Modals/BaseModal.tsx";
import { EmojiPicker } from "pursuit/components/Pickers/EmojiPicker";
import {
  ADD_BUCKET_CATEGORY,
  ADD_BUCKET_ITEM,
  GET_BUCKET_CATEGORIES,
} from "pursuit/graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Loading, Error } from "components/Layout";
import { GetBucketCategoriesQuery } from "pursuit/graphql/types";

interface FormData {
  itemName: string;
  description: string;
  categoryId?: string;
  newCategoryName?: string;
  newCategoryEmoji?: string;
}

interface AddBucketItemProps {
  visible: boolean;
  onClose: () => void;
}

export const AddBucketItem = ({ visible, onClose }: AddBucketItemProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      itemName: "",
      description: "",
      categoryId: "",
      newCategoryName: "",
      newCategoryEmoji: "",
    },
  });

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const {
    loading: categoriesLoading,
    data: categoriesData,
    error: categoriesError,
  } = useQuery<GetBucketCategoriesQuery>(GET_BUCKET_CATEGORIES);
  const [addBucketCategory] = useMutation(ADD_BUCKET_CATEGORY);
  const [addBucketItem, { loading: addItemLoading }] = useMutation(
    ADD_BUCKET_ITEM,
    {
      onCompleted: () => {
        handleClose();
      },
      onError: (error) => {
        console.error("Error adding bucket item:", error);
      },
    }
  );

  const bucketCategories = categoriesData?.getBucketCategories || [];

  if (categoriesError) {
    console.error("Error loading categories:", categoriesError);
  }

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSubmit = async (data: FormData) => {
    addBucketItem({
      variables: {
        title: data.itemName,
        description: data.description || null,
        categoryId: data.categoryId || null,
        newCategoryName: data.newCategoryName || null,
        newCategoryEmoji: data.newCategoryEmoji || null,
      },
    });
  };

  const onError = (errors: any) => {
    shakeError();
  };

  const handleClose = () => {
    reset();
    setSelectedEmoji("");
    setShowNewCategoryForm(false);
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      variant="fullScreen"
      onClose={handleClose}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}
      >
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

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>📂 Choose Category</Text>
            <View style={styles.categoryToggle}>
              <Pressable
                style={[
                  styles.toggleButton,
                  !showNewCategoryForm && styles.toggleButtonActive,
                ]}
                onPress={handleSelectExistingCategory}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !showNewCategoryForm && styles.toggleTextActive,
                  ]}
                >
                  Existing Category
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleButton,
                  showNewCategoryForm && styles.toggleButtonActive,
                ]}
                onPress={handleCreateNewCategory}
              >
                <Text
                  style={[
                    styles.toggleText,
                    showNewCategoryForm && styles.toggleTextActive,
                  ]}
                >
                  Create New
                </Text>
              </Pressable>
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
                        style={[
                          styles.picker,
                          Platform.OS === "ios" ? { marginTop: -30 } : {},
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
                render={({ field: { value } }) => (
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
            text="🚀 Add to Bucket List!"
            variant="primary"
            onPress={handleSubmit(onSubmit, onError)}
            disabled={addItemLoading}
            style={styles.addButton}
          />
        </View>
      </Animated.View>
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
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.thunder,
  },
  toggleTextActive: {
    color: colors.white,
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
    height: Platform.OS === "ios" ? 200 : 160, // Show 4 items at first glance
    justifyContent: "flex-start", // Move items to upper side
  },
  picker: {
    width: "100%",
    backgroundColor: colors.white,
    color: colors.thunder,
    height: Platform.OS === "ios" ? 200 : 160, // Show 4 items at first glance
    marginTop: 0, // Remove extra margin
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.thunder,
    marginBottom: 8,
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
});
