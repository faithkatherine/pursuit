import { ApolloProvider } from "@apollo/client";
import { client } from "pursuit/graphql/client";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            header() {
              return <View style={styles.header}></View>;
            },
            headerShown: true,
            headerTitle: "",
          }}
        />
      </Stack>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "transparent",
  },
});
