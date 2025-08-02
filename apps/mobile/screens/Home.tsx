import { View, Text, StyleSheet } from "react-native";
import Layout from "components/Layout";
import { InsightsCard } from "pursuit/components/Cards/InsightsCard";
import { typography } from "pursuit/themes/tokens/typography";
import { theme } from "pursuit/themes/tokens/colors";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A simple screen that displays a welcome message.
 *
 * This is a placeholder for what will eventually be a more complex UI.
 *
 * @returns A component that displays a welcome message.
 */
/*******  56fcf1e9-43e9-4ce1-a38e-0475d503e721  *******/ const Home = () => {
  console.log(typography.h1);
  return (
    <Layout>
      <Text style={styles.greeting}>Good morning, Faith</Text>
      <InsightsCard />
    </Layout>
  );
};

const styles = StyleSheet.create({
  greeting: {
    color: theme.text.primary,
    marginBottom: 20,
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    lineHeight: typography.h4.fontSize * typography.h1.lineHeight, // Convert to absolute value for RN
  },
});

export default Home;
