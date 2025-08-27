import { ApolloProvider } from "@apollo/client";
import { client } from "pursuit/graphql/client";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
    </ApolloProvider>
  );
}
