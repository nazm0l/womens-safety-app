import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Create Post",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#333",
        }}
      />
    </Stack>
  );
}
