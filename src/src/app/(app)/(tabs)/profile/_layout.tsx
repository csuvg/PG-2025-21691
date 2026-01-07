import { useScreenTimer } from "@/hooks/use-screen-timer";
import { Stack } from "@layouts/stack";
import { Icon } from "@roninoss/icons";
import { router } from "expo-router";
import { Platform, Pressable } from "react-native";
import Transition from "react-native-screen-transitions";
import { useUnistyles } from "react-native-unistyles";

export default function ProfileLayout() {
  const { theme } = useUnistyles();
  useScreenTimer("profile");
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerLargeTitle: Platform.OS === "ios",
          headerLargeTitleStyle: {
            fontSize: 26,
            fontFamily: "InstrumentSans_600SemiBold",
          },
          headerTitle: "Perfil",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(app)/(tabs)/profile/settings")}
            >
              <Icon
                name="gearshape.fill"
                size={24}
                namingScheme="sfSymbol"
                color={theme.colors.textSecondary}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          ...Transition.presets.ZoomIn(),
          enableTransitions: true,
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Ajustes",
          headerStyle: { backgroundColor: theme.colors.headerBackground },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Mi cuenta",
          headerStyle: { backgroundColor: theme.colors.headerBackground },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
