import { useOnboardingStore } from "@/stores/onboarding";
import { Icon } from "@roninoss/icons";
import { BlurView, type BlurTint } from "expo-blur";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";

const UBlurView = withUnistyles(BlurView, (theme, rt) => ({
  tint: theme.colors.background as BlurTint,
}));

export default function TabLayout() {
  const { theme, rt } = useUnistyles();
  const { reset } = useOnboardingStore();

  useEffect(() => {
    reset();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor:
          rt.colorScheme === "dark"
            ? theme.colors.dimmed
            : theme.colors.neutral[500],
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <UBlurView intensity={100} style={StyleSheet.absoluteFillObject} />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                // { backgroundColor: theme.colors.background },
              ]}
            />
          ),
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: styles.tabBarStyle,
        sceneStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="careers"
        options={{
          title: "Carreras",
          tabBarIcon: ({ color }) => (
            <Icon
              size={28}
              name={Platform.OS === "android" ? "house.fill" : "book.fill"}
              color={color}
              namingScheme="sfSymbol"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color }) => (
            <Icon
              size={28}
              name="magnifyingglass"
              color={color}
              namingScheme="sfSymbol"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => (
            <Icon
              size={28}
              name="message.fill"
              color={color}
              namingScheme="sfSymbol"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Icon
              size={28}
              name="person.fill"
              color={color}
              namingScheme="sfSymbol"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create(theme => ({
  tabBarStyle: {
    position: "absolute",
    zIndex: 0,
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
      android: {
        shadowColor: "transparent",
        elevation: 8,
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.border,
      },
    }),
  },
}));
