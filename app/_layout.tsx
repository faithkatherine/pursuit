import { ApolloProvider } from "@apollo/client";
import { client } from "graphql/client";
import { Stack, useRouter, useSegments } from "expo-router";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
