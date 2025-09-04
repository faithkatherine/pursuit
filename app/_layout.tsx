import { ApolloProvider } from "@apollo/client";
import { client } from "graphql/client";
import { Stack, useRouter, useSegments } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import { useEffect } from "react";

function InitialLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign in if not authenticated and not in auth group
      router.replace("/auth/signin");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth group
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <Stack>
      <Stack.Screen
        name="auth/signin"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{
          headerShown: false,
        }}
      />
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
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "transparent",
  },
});
