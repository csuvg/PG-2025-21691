import { useScreenTimer } from "@/hooks/use-screen-timer";
import { Stack } from "@layouts/stack";
import Transition from "react-native-screen-transitions";

export default function ExploreLayout() {
  useScreenTimer("explore");

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: "Explorar" }} />
      <Stack.Screen
        name="[id]"
        options={{
          ...Transition.presets.ZoomIn(),
          enableTransitions: true,
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
    </Stack>
  );
}
