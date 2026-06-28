import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@shared/constants/tokens/colors";
import { webTypography } from "@shared/constants/tokens/typography";

// ─── Layout constants ──────────────────────────────────────────────────────
const CONTENT_PADDING_H = 24;
const FULL_VIEWPORT_HEIGHT = "100vh" as never;
const PANEL_WIDTH = "50%";
const LEFT_PANEL_PADDING = 56;
const RIGHT_PANEL_PADDING = 40;
const BRAND_TOP = 40;
const FORM_MAX_WIDTH = 380;
const EDITORIAL_MAX_WIDTH = 520;
const BRAND_SIZE = 18;
const FORM_BRAND_SIZE = 16;
const WORDMARK_TRACKING = 3;
const EDITORIAL_TITLE_SIZE = 48;
const EDITORIAL_TITLE_LINE_HEIGHT = 56;
const EDITORIAL_SUBTITLE_SIZE = 17;
const EDITORIAL_SUBTITLE_LINE_HEIGHT = 26;
const PANEL_TITLE_SIZE = 30;
const STACK_GAP = 16;
// ──────────────────────────────────────────────────────────────────────────

interface AuthWebShellProps {
  title: string;
  subtitle: string;
  panelTitle: string;
  children: ReactNode;
}

export const AuthWebShell = ({
  title,
  subtitle,
  panelTitle,
  children,
}: AuthWebShellProps) => (
  <View style={styles.page}>
    <LinearGradient
      colors={[colors.pursuitPurple, colors.pursuitRose]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.leftPanel}
    >
      <Text style={styles.brand}>PURSUIT</Text>
      <View style={styles.editorialCopy}>
        <Text style={styles.editorialTitle}>{title}</Text>
        <Text style={styles.editorialSubtitle}>{subtitle}</Text>
      </View>
    </LinearGradient>

    <View style={styles.rightPanel}>
      <View style={styles.formInner}>
        <Text style={styles.formBrand}>PURSUIT</Text>
        <Text style={styles.panelTitle}>{panelTitle}</Text>
        <View style={styles.formStack}>{children}</View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  page: {
    width: "100%",
    minHeight: FULL_VIEWPORT_HEIGHT,
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  leftPanel: {
    width: PANEL_WIDTH,
    minHeight: FULL_VIEWPORT_HEIGHT,
    justifyContent: "center",
    padding: LEFT_PANEL_PADDING,
  },
  rightPanel: {
    width: PANEL_WIDTH,
    minHeight: FULL_VIEWPORT_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    padding: RIGHT_PANEL_PADDING,
  },
  brand: {
    position: "absolute",
    top: BRAND_TOP,
    left: LEFT_PANEL_PADDING,
    fontFamily: webTypography.wordmark.fontFamily,
    fontSize: BRAND_SIZE,
    fontWeight: webTypography.wordmark.fontWeight,
    letterSpacing: WORDMARK_TRACKING,
    color: colors.white,
  },
  editorialCopy: {
    maxWidth: EDITORIAL_MAX_WIDTH,
  },
  editorialTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: EDITORIAL_TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    lineHeight: EDITORIAL_TITLE_LINE_HEIGHT,
    color: colors.white,
  },
  editorialSubtitle: {
    marginTop: STACK_GAP,
    fontFamily: webTypography.body.fontFamily,
    fontSize: EDITORIAL_SUBTITLE_SIZE,
    fontWeight: webTypography.body.fontWeight,
    lineHeight: EDITORIAL_SUBTITLE_LINE_HEIGHT,
    color: "rgba(255,255,255,0.86)",
  },
  formInner: {
    width: "100%",
    maxWidth: FORM_MAX_WIDTH,
  },
  formBrand: {
    fontFamily: webTypography.wordmark.fontFamily,
    fontSize: FORM_BRAND_SIZE,
    fontWeight: webTypography.wordmark.fontWeight,
    letterSpacing: WORDMARK_TRACKING,
    color: colors.pursuitPurple,
    marginBottom: CONTENT_PADDING_H,
  },
  panelTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: PANEL_TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
    marginBottom: CONTENT_PADDING_H,
  },
  formStack: {
    gap: STACK_GAP,
  },
});
