import { StyleSheet, Text, View } from "react-native";
import { colors } from "themes/tokens/colors";
import { webTypography } from "themes/tokens/typography";

const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 48;
const TOP_PADDING = 48;
const BOTTOM_PADDING = 24;
const EYEBROW_SIZE = 11;
const HEADLINE_SIZE = 56;
const HEADLINE_LINE_HEIGHT = 62;
const BODY_SIZE = 16;
const BODY_LINE_HEIGHT = 26;
const BODY_MAX_WIDTH = 520;

type HomeGreetingProps = {
  firstName: string;
  greetingWord: string;
};

export const HomeGreeting = ({ firstName, greetingWord }: HomeGreetingProps) => (
  <View style={styles.band}>
    <View style={styles.inner}>
      <Text style={styles.eyebrow}>THIS WEEK IN NAIROBI · 6 - 22 JUNE</Text>
      <Text style={styles.headline}>
        Good {greetingWord.toLowerCase()}, {firstName}.
      </Text>
      <Text style={styles.headlineAccent}>Here&apos;s what&apos;s worth your time.</Text>
      <Text style={styles.body}>
        Twelve picks from the city&apos;s quietest corners and loudest weekends.
        {"\n"}Curated by humans who actually went, with opinions.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  band: {
    width: "100%",
    backgroundColor: colors.pursuitWarmBg,
    paddingTop: TOP_PADDING,
    paddingBottom: BOTTOM_PADDING,
  },
  inner: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: "auto",
    paddingHorizontal: CONTENT_PADDING_H,
  },
  eyebrow: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: EYEBROW_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitPurple,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 26,
  },
  headline: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: HEADLINE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    lineHeight: HEADLINE_LINE_HEIGHT,
    color: colors.pursuitTextPrimary,
  },
  headlineAccent: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: HEADLINE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    fontStyle: "italic",
    lineHeight: HEADLINE_LINE_HEIGHT,
    color: colors.pursuitPurple,
  },
  body: {
    maxWidth: BODY_MAX_WIDTH,
    marginTop: 16,
    fontFamily: webTypography.body.fontFamily,
    fontSize: BODY_SIZE,
    fontWeight: webTypography.body.fontWeight,
    lineHeight: BODY_LINE_HEIGHT,
    color: colors.pursuitTextMuted,
  },
});
