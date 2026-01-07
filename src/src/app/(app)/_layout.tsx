import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

export default function AuthedLayout() {
  const { theme } = useUnistyles();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* Quiz */}
      <Stack.Screen name="index" />
      {/* Reading modal */}
      <Stack.Screen
        name="reading"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      {/* Normal App */}
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: "none",
        }}
      />
    </Stack>
  );
}
