import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useRef } from "react";
import colors from "pursuit/themes/tokens/colors";
import { Button } from "pursuit/components/Buttons/Buttons";
import {
  GET_EMOJI_LIBRARY,
  ADD_BUCKET_CATEGORY,
  ADD_BUCKET_ITEM,
  GET_BUCKET_CATEGORIES,
} from "pursuit/graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Loading, Error } from "components/Layout";
import { Emoji, GetEmojiLibraryQuery } from "pursuit/graphql/types";

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
  
  const { loading, error, data } = useQuery<GetEmojiLibraryQuery>(GET_EMOJI_LIBRARY);
  const { loading: categoriesLoading, data: categoriesData } = useQuery(GET_BUCKET_CATEGORIES);
  const [addBucketCategory] = useMutation(ADD_BUCKET_CATEGORY);
  const [addBucketItem, { loading: addItemLoading }] = useMutation(ADD_BUCKET_ITEM, {
    onCompleted: () => {
      handleClose();
    },
    onError: (error) => {
      console.error("Error adding bucket item:", error);
    },
  });

  const bucketCategories = categoriesData?.getBucketCategories || [];

  const categoryId = watch("categoryId");

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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <Animated.View
        style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>✨ Add to Your Bucket List ✨</Text>
          <Text style={styles.subtitle}>What's your next adventure?</Text>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
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
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Text style={styles.pickerLabel}>Select existing category:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value || ""}
                      onValueChange={(itemValue) => {
                        console.log("Selected category:", itemValue);
                        onChange(itemValue);
                      }}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item 
                        label="-- Select a category --" 
                        value="" 
                      />
                      {bucketCategories.length > 0 ? (
                        bucketCategories.map((category) => (
                          <Picker.Item
                            key={category.id}
                            label={`${category.emoji} ${category.name}`}
                            value={category.id}
                          />
                        ))
                      ) : (
                        <Picker.Item 
                          label="No categories available" 
                          value="none" 
                          enabled={false}
                        />
                      )}
                    </Picker>
                  </View>
                  {bucketCategories.length === 0 && (
                    <Text style={styles.noCategoriesText}>
                      No categories found. Create a new category instead.
                    </Text>
                  )}
                </View>
              )}
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
                    <ScrollView
                      style={styles.emojiScrollContainer}
                      contentContainerStyle={styles.emojiGrid}
                      showsVerticalScrollIndicator={false}
                    >
                      {loading && <Loading />}
                      {error && (
                        <Error error={error.message || "Something went wrong"} />
                      )}

                      {data &&
                        data.getEmojiLibrary.map((emoji, index) => (
                          <Pressable
                            key={index}
                            style={[
                              styles.emojiOption,
                              selectedEmoji === emoji.symbol &&
                                styles.selectedEmoji,
                            ]}
                            onPress={() => {
                              setSelectedEmoji(emoji.symbol);
                              setValue("newCategoryEmoji", emoji.symbol);
                            }}
                          >
                            <Text style={styles.emojiText}>{emoji.symbol}</Text>
                          </Pressable>
                        ))}
                    </ScrollView>
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
    padding: 20,
    backgroundColor: colors.white,
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
  closeButton: {
    position: "absolute",
    top: -10,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.prim,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: colors.thunder,
    fontWeight: "600",
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
    marginBottom: 16,
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
  },
  picker: {
    height: 50,
    backgroundColor: colors.white,
    color: colors.thunder,
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
  emojiScrollContainer: {
    maxHeight: 150,
    borderRadius: 16,
    backgroundColor: colors.prim,
    padding: 16,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  emojiOption: {
    width: 45,
    height: 45,
    backgroundColor: colors.prim,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.silverSand,
    elevation: 2,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedEmoji: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.deluge,
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 20,
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