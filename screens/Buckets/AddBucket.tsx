import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useRef } from "react";
import { ShakeAnimatedView, ShakeAnimatedViewRef } from "components/Animations";
import { useRouter } from "expo-router";
import colors from "themes/tokens/colors";
import { Button } from "components/Buttons";
import { EmojiPicker } from "components/Pickers";
import { ADD_BUCKET_CATEGORY } from "graphql/queries";
import { useMutation } from "@apollo/client";

interface FormData {
  bucketName: string;
  emoji: string;
}

interface AddBucketProps {
  onClose?: () => void;
}

export const AddBucket = ({ onClose }: AddBucketProps) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bucketName: "",
      emoji: "",
    },
  });

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shakeViewRef = useRef<ShakeAnimatedViewRef>(null);
  const [addBucketCategory, { loading: addBucketLoading }] =
    useMutation(ADD_BUCKET_CATEGORY);

  const shakeError = () => {
    shakeViewRef.current?.shake();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await addBucketCategory({
        variables: {
          name: data.bucketName,
          emoji: data.emoji,
        },
      });

      // Show success toast
      Alert.alert(
        "🎉 Success!",
        "Your bucket category has been created successfully!",
        [
          {
            text: "Great!",
            onPress: () => {
              onClose?.();
              router.push("/(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adding bucket category:", error);

      // Show error alert with retry option
      Alert.alert(
        "Oops!",
        "Something went wrong while creating your bucket category. Would you like to try again?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              onClose?.();
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

  const onError = (errors: any) => {
    shakeError();
  };
  return (
    <ShakeAnimatedView ref={shakeViewRef} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Create Your Dream Bucket ✨</Text>
        <Text style={styles.subtitle}>What adventure are you planning?</Text>
      </View>

      <Controller
        control={control}
        name="bucketName"
        rules={{
          required: "Bucket name is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>🏷️ Bucket Name</Text>
            <TextInput
              style={[styles.input, errors.bucketName && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="My Amazing Adventure"
              placeholderTextColor={colors.aluminium}
            />
            {errors.bucketName && (
              <Text style={styles.error}>
                ✋ Don't forget to name your bucket!
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="emoji"
        rules={{
          required: "Emoji is required",
        }}
        render={({ field: { value } }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              🎭 Choose Your Bucket's Personality
            </Text>
            {errors.emoji && (
              <Text style={styles.error}>
                🎯 Pick an emoji that represents your bucket!
              </Text>
            )}

            <EmojiPicker
              selectedEmoji={selectedEmoji}
              onEmojiSelect={(emoji) => {
                setSelectedEmoji(emoji);
                setValue("emoji", emoji);
              }}
              maxHeight={200}
            />
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button
          text={
            isSubmitting || addBucketLoading
              ? "✨ Creating..."
              : "🚀 Create My Bucket!"
          }
          variant="primary"
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isSubmitting || addBucketLoading}
          style={styles.createButton}
        />
      </View>
    </ShakeAnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
  inputError: {
    borderColor: colors.shilo,
    borderWidth: 2,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  createButton: {
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
  error: {
    color: colors.shilo,
    fontSize: 15,
    marginTop: 8,
    fontWeight: "500",
  },
});
