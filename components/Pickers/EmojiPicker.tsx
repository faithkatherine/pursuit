import React from "react";
import { ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_EMOJI_LIBRARY } from "graphql/queries";
import { Loading, Error } from "components/Layout";
import { GetEmojiLibraryQuery } from "graphql/types";
import colors from "themes/tokens/colors";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
  maxHeight?: number;
}

export const EmojiPicker = ({
  selectedEmoji,
  onEmojiSelect,
  maxHeight = 150,
}: EmojiPickerProps) => {
  const { loading, error, data } =
    useQuery<GetEmojiLibraryQuery>(GET_EMOJI_LIBRARY);

  return (
    <ScrollView
      style={[styles.emojiScrollContainer, { maxHeight }]}
      contentContainerStyle={styles.emojiGrid}
      showsVerticalScrollIndicator={false}
    >
      {loading && <Loading />}
      {error && <Error error={error.message || "Something went wrong"} />}

      {data &&
        data.getEmojiLibrary.map((emoji, index) => (
          <Pressable
            key={index}
            style={[
              styles.emojiOption,
              selectedEmoji === emoji.symbol && styles.selectedEmoji,
            ]}
            onPress={() => onEmojiSelect(emoji.symbol)}
          >
            <Text style={styles.emojiText}>{emoji.symbol}</Text>
          </Pressable>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emojiScrollContainer: {
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
});
