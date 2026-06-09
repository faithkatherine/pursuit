import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PURSUIT = {
  purple: "#7C5C9C",
  rose: "#E8B5B0",
  textPrimary: "#1A1A2E",
  textMuted: "#8A7F7A",
  white: "#FFFFFF",
};

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
      colors={[PURSUIT.purple, PURSUIT.rose]}
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
    minHeight: "100vh" as never,
    flexDirection: "row",
    backgroundColor: PURSUIT.white,
  },
  leftPanel: {
    width: "50%",
    minHeight: "100vh" as never,
    justifyContent: "center",
    padding: 56,
  },
  rightPanel: {
    width: "50%",
    minHeight: "100vh" as never,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PURSUIT.white,
    padding: 40,
  },
  brand: {
    position: "absolute",
    top: 40,
    left: 56,
    fontFamily: "Work Sans",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
    color: PURSUIT.white,
  },
  editorialCopy: {
    maxWidth: 520,
  },
  editorialTitle: {
    fontFamily: "Poppins",
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 56,
    color: PURSUIT.white,
  },
  editorialSubtitle: {
    marginTop: 16,
    fontFamily: "Work Sans",
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 26,
    color: "rgba(255,255,255,0.86)",
  },
  formInner: {
    width: "100%",
    maxWidth: 380,
  },
  formBrand: {
    fontFamily: "Work Sans",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
    color: PURSUIT.purple,
    marginBottom: 24,
  },
  panelTitle: {
    fontFamily: "Poppins",
    fontSize: 30,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
    marginBottom: 24,
  },
  formStack: {
    gap: 16,
  },
});
