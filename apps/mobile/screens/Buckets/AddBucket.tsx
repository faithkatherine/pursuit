import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { useState, useRef } from "react";
import colors from "pursuit/themes/tokens/colors";
import { Button } from "pursuit/components/Buttons/Buttons";
import {
  GET_EMOJI_LIBRARY,
  ADD_BUCKET_CATEGORY,
} from "pursuit/graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Loading, Error } from "components/Layout";
import { Emoji, GetEmojiLibraryQuery } from "pursuit/graphql/types";

interface FormData {
  bucketName: string;
  emoji: string;
}

export const AddBucket = () => {
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const { loading, error, data } =
    useQuery<GetEmojiLibraryQuery>(GET_EMOJI_LIBRARY);
  const [addBucketCategory, { loading: addBucketLoading }] = useMutation(
    ADD_BUCKET_CATEGORY,
    {
      onCompleted: () => {
        setHasSubmitted(true);
      },
      onError: (error) => {
        console.error("Error adding bucket category:", error);
      },
    }
  );

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

  const onSubmit = (data: FormData) => {
    addBucketCategory({
      variables: {
        name: data.bucketName,
        emoji: data.emoji,
      },
    });
  };

  const onError = (errors: any) => {
    shakeError();
  };
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}
    >
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
                data.getEmojiLibrary
                  .map((emoji: Emoji) => emoji)
                  .map((emoji, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.emojiOption,
                        selectedEmoji === emoji.symbol && styles.selectedEmoji,
                      ]}
                      onPress={() => {
                        setSelectedEmoji(emoji.symbol);
                        setValue("emoji", emoji.symbol);
                      }}
                    >
                      <Text style={styles.emojiText}>{emoji.symbol}</Text>
                    </Pressable>
                  ))}
            </ScrollView>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button
          text="🚀 Create My Bucket!"
          variant="primary"
          onPress={handleSubmit(onSubmit, onError)}
          disabled={addBucketLoading || hasSubmitted}
          style={styles.createButton}
        />
      </View>
    </Animated.View>
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
  emojiScrollContainer: {
    maxHeight: 200,
    borderRadius: 16,
    backgroundColor: colors.prim,
    padding: 16,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  emojiOption: {
    width: 60,
    height: 60,
    backgroundColor: colors.prim,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.silverSand,
    elevation: 3,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  selectedEmoji: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.deluge,
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 24,
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
