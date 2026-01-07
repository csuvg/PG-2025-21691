import GoogleOAuthButton from "@/components/auth/google-oauth-button";
import AppBackground from "@/components/ui/app-background";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { useWarmUpBrowser } from "@/hooks/use-warmup-browser";
import { useAuth, useSSO } from "@clerk/clerk-expo";
import Entypo from "@expo/vector-icons/Entypo";
import * as AuthSession from "expo-auth-session";
import { Link, Redirect, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { isSignedIn } = useAuth();
  const { theme } = useUnistyles();
  const ref = useRef<ScrollView>(null);
  const idx = useSharedValue(0);

  // Animated welcome loop inspired by Results/Pre-quiz screens
  const AnimatedParagraph = Animated.createAnimatedComponent(Paragraph);

  const onboardingMessages = [
    "Descubre tu carrera.",
    "Explora y combina opciones.",
    "Recibe recomendaciones personalizadas.",
    "Refina tu perfil con cada interacción.",
    "Encuentra inspiración para tu futuro.",
  ];

  const [currentMessage, setCurrentMessage] = useState(onboardingMessages[0]);
  const messageIndex = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const messageScale = useSharedValue(0.98);

  const cycleColors = [
    theme.colors.accents.blue,
    theme.colors.accents.pink,
    theme.colors.accents.lavender,
    theme.colors.accents.yellow,
    theme.colors.accents.blueish,
  ];
  const circleRotate = useSharedValue(0);
  const currentTextColor = useSharedValue(cycleColors[0]);

  useEffect(() => {
    // Start subtle rotating dashed circle
    circleRotate.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    // Fade in first message after the welcome appears
    messageOpacity.value = withTiming(1, { duration: 500 });
    messageScale.value = withTiming(1, { duration: 600 });

    const interval = setInterval(() => {
      messageScale.value = withTiming(0.96, { duration: 250 });
      messageOpacity.value = withTiming(0, { duration: 250 }, () => {
        messageIndex.value =
          (messageIndex.value + 1) % onboardingMessages.length;
        // Update text and color per message change
        runOnJS(setCurrentMessage)(onboardingMessages[messageIndex.value]);
        currentTextColor.value = withTiming(cycleColors[messageIndex.value], {
          duration: 250,
        });
        messageOpacity.value = withTiming(1, { duration: 400 });
        messageScale.value = withTiming(1, { duration: 500 });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    color: currentTextColor.value,
    opacity: messageOpacity.value,
  }));

  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ scale: messageScale.value }],
  }));

  // Rotating dashed circle style + text color binding
  const circleStyle = useAnimatedStyle(() => {
    const angle = circleRotate.value % 360;
    return {
      transform: [{ rotate: `${angle}deg` }],
      borderColor: currentTextColor.value,
    };
  });

  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  async function handleGoogleSignIn() {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "mirai",
            path: "/",
          }),
        });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            router.push("/(app)");
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (isSignedIn) {
    return <Redirect href={"/(app)"} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppBackground />

      <View style={styles.content}>
        <Animated.View
          entering={FadeIn.duration(900)
            .delay(200)
            .withInitialValues({ opacity: 0 })}
        >
          <Image
            source={require("@assets/images/brand/logo-no-text.png")}
            style={styles.logo}
          />
        </Animated.View>
        <Animated.View entering={FadeIn.duration(1000).delay(350)}>
          <Heading level={1} color="primary">
            Bienvenido a Mirai
          </Heading>
        </Animated.View>
        {/* Static paragraph removed; animated loop below conveys the message */}

        {/* Animated onboarding loop */}
        <Animated.View
          entering={FadeInUp.duration(800).delay(700)}
          style={styles.loopContainer}
        >
          <AnimatedParagraph style={[styles.loopText, textStyle, messageStyle]}>
            {currentMessage}
          </AnimatedParagraph>
        </Animated.View>
      </View>
      <Animated.View
        style={styles.actions}
        entering={FadeInUp.duration(800).delay(1000)}
      >
        <GoogleOAuthButton onPress={handleGoogleSignIn} />
        <Link href="/(auth)/sign-up" asChild>
          <Button
            title="Crear cuenta con correo"
            style={{
              backgroundColor: "black",
              borderColor: "black",
              width: "100%",
            }}
            textStyle={{ color: "white" }}
            icon={<Entypo name="mail" size={20} color="white" />}
          />
        </Link>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  actions: {
    gap: 10,
    width: "100%",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  loopContainer: {
    marginTop: theme.gap(0.5),
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.gap(1),
  },
  loopText: {
    fontSize: 17,
    textAlign: "center",
    fontFamily: "InstrumentSans_600SemiBold",
  },
}));
