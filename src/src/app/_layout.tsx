import { Icon } from "@roninoss/icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import React, { useEffect } from "react";
import { LogBox } from "react-native";

import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";

import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import useExpoRouterScreenTracking from "@/hooks/use-expo-router-screen-tracking";
import { Toaster } from "sonner-native";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Feather } from "@expo/vector-icons";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUnistyles } from "react-native-unistyles";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const USABILITY_TEST = true;

export default function RootLayout() {
  const { theme, rt } = useUnistyles();

  // Hide logs during usability tests
  if (USABILITY_TEST) {
    LogBox.ignoreAllLogs(true);
  }

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  const [loaded, error] = useFonts({
    // Instrument Sans variants
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,

    // Inter variants
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider
      value={{
        dark: rt.colorScheme === "dark",
        colors: {
          primary:
            rt.colorScheme === "dark"
              ? theme.colors.tint
              : theme.colors.typography,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.typography,
          border: theme.colors.border,
          notification: theme.colors.textPrimary,
        },
        fonts: {
          regular: {
            fontFamily: "InstrumentSans_400Regular",
            fontWeight: "400",
          },
          medium: {
            fontFamily: "InstrumentSans_500Medium",
            fontWeight: "500",
          },
          bold: {
            fontFamily: "InstrumentSans_600SemiBold",
            fontWeight: "600",
          },
          heavy: {
            fontFamily: "InstrumentSans_700Bold",
            fontWeight: "700",
          },
        },
      }}
    >
      <PostHogProvider
        apiKey="phc_zNn2CdN49FUiZ0XHRwHyqpyPkWnAPeBlfhTuaDNqtTp"
        options={{
          host: "https://us.i.posthog.com",
          enableSessionReplay: false,
          captureAppLifecycleEvents: true,
        }}
        debug={false}
        autocapture={{
          captureScreens: false,
          captureTouches: false,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider
              tokenCache={tokenCache}
              publishableKey={
                process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string
              }
            >
              <StatusBar style="auto" />
              <RootNavigator />
              <Toaster
                position="top-center"
                duration={2000}
                icons={{
                  success: (
                    <Feather name="check" size={24} color={theme.colors.tint} />
                  ),
                  error: (
                    <Icon
                      namingScheme="sfSymbol"
                      name="xmark.circle"
                      size={24}
                      color={theme.colors.danger}
                    />
                  ),
                  warning: (
                    <Feather name="alert-circle" size={24} color="black" />
                  ),
                  info: <Feather name="info" size={24} color="black" />,
                  loading: <Feather name="loader" size={24} color="black" />,
                }}
                toastOptions={{
                  style: {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: theme.radius["2xl"],
                  },
                }}
              />
            </ClerkProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { theme } = useUnistyles();

  const { isSignedIn, isLoaded, userId } = useAuth();
  const posthog = usePostHog();
  const { user } = useUser();

  useEffect(() => {
    const syncIdentity = async () => {
      if (!isLoaded || !posthog) return;

      const currentId = await posthog.getDistinctId();

      if (isSignedIn && userId && user) {
        if (currentId !== userId) {
          posthog.identify(userId, {
            email: user.primaryEmailAddress?.emailAddress as string,
          });
        }
      } else if (!isSignedIn) {
        posthog.reset();
      }
    };

    syncIdentity();
  }, [isSignedIn, userId, user, posthog]);

  useExpoRouterScreenTracking();

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerBackVisible: true,
        headerBackTitle: "Atrás",
        headerBackTitleStyle: {
          fontFamily: "InstrumentSans_500Medium",
          fontSize: 15,
        },
      }}
    >
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen
          name="(app)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(auth)/sign-in"
          options={{
            title: "",
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="(auth)/sign-up"
          options={{
            title: "",
            headerShadowVisible: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
