import { Stack } from "expo-router";

export default function EventModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          gestureEnabled: true, // Allow back gesture on detail screen
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
