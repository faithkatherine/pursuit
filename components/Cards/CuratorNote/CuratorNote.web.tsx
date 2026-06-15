import { StyleSheet, Text, View } from "react-native";
import { colors } from "themes/tokens/colors";
import { webTypography } from "themes/tokens/typography";

const MIN_HEIGHT = 310;
const PADDING = 32;
const QUOTE_SIZE = 18;
const QUOTE_LINE_HEIGHT = 29;
const META_SIZE = 13;

type CuratorNoteProps = {
  quote: string;
  author: string;
  role: string;
};

export const CuratorNote = ({ quote, author, role }: CuratorNoteProps) => (
  <View style={styles.card}>
    <Text style={styles.eyebrow}>Pursuit says</Text>
    <Text style={styles.quote}>"{quote}"</Text>
    <Text style={styles.attribution}>
      - {author}, {role}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    minHeight: MIN_HEIGHT,
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#FAF6F1",
    padding: PADDING,
  },
  eyebrow: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 11,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitPurple,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 22,
  },
  quote: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: QUOTE_SIZE,
    fontWeight: webTypography.body.fontWeight,
    fontStyle: "italic",
    lineHeight: QUOTE_LINE_HEIGHT,
    color: colors.pursuitTextPrimary,
  },
  attribution: {
    marginTop: 18,
    fontFamily: webTypography.body.fontFamily,
    fontSize: META_SIZE,
    fontWeight: webTypography.body.fontWeight,
    color: colors.pursuitTextMuted,
  },
});
