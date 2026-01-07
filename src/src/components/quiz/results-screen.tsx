import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { useAnalytics } from "@/hooks/use-analytics";
import { useQuizStore } from "@/stores/quiz";
import { accents } from "@/unistyles";
import { Icon } from "@roninoss/icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const AnimatedHeading = Animated.createAnimatedComponent(Heading);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const loadingMessages = [
  "Calculando tus resultados.",
  "Analizando tus respuestas.",
  "Afinando detalles finales.",
];

export default function ResultsScreen({ loading }: { loading: boolean }) {
  const { theme } = useUnistyles();
  const analytics = useAnalytics();
  const { getSessionInfo } = useQuizStore();
  const loadingProgress = useSharedValue(loading ? 1 : 0);
  const router = useRouter();
  useEffect(() => {
    loadingProgress.value = withTiming(loading ? 1 : 0, { duration: 1000 });
  }, [loading]);

  const currentTextColor = useSharedValue(accents.blue);
  const messageIndex = useSharedValue(0);
  const messageOpacity = useSharedValue(1);
  const messageScale = useSharedValue(1);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  //   const rotationProgress = useSharedValue(0);
  //   const lastFrameTime = useSharedValue(0);
  //   const startTime = useSharedValue(0);

  const progressValue = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 5000, easing: Easing.linear }),
      -1,
      false // don’t reverse
    );
    progressValue.value = withRepeat(
      withTiming(1, {
        duration: 10000,
      }),
      -1,
      false
    );
  }, []);

  useAnimatedReaction(
    () => progressValue.value,
    value => {
      currentTextColor.value = interpolateColor(
        value,
        [0, 0.25, 0.5, 0.75, 1],
        [
          accents.blue,
          accents.blueish,
          accents.pink,
          accents.lavender,
          accents.blue,
        ]
      ) as string;
    },
    [progressValue]
  );

  const messageStyle = useAnimatedStyle(() => {
    return {
      opacity: messageOpacity.value,
      transform: [
        {
          scale: messageScale.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (!loading) return;

    messageIndex.value = 0;
    runOnJS(setCurrentMessage)(loadingMessages[0]);

    const interval = setInterval(() => {
      // Fade out current message
      messageScale.value = withTiming(0.8, { duration: 300 });
      messageOpacity.value = withTiming(0, { duration: 300 }, () => {
        // Update index safely on UI thread
        messageIndex.value = (messageIndex.value + 1) % loadingMessages.length;

        // Send to JS
        runOnJS(setCurrentMessage)(loadingMessages[messageIndex.value]);

        // Fade back in
        messageOpacity.value = withTiming(1, { duration: 400 });
        messageScale.value = withTiming(1, { duration: 500 });
      });
    }, 4500); // stays visible ~4.5s before switching

    return () => clearInterval(interval);
  }, [loading]);

  const textStyle = useAnimatedStyle(() => {
    return {
      color: currentTextColor.value,
      opacity: messageOpacity.value,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    // take modulo so it smoothly wraps around
    const angle = rotate.value % 360;
    return {
      opacity: messageOpacity.value,
      transform: [{ rotate: `${angle}deg` }],
    };
  });

  const loadingContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loadingProgress.value, [0, 1], [0, 1]),
      transform: [
        {
          translateY: interpolate(loadingProgress.value, [0, 1], [20, 0]),
        },
      ],
    };
  });

  const successContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loadingProgress.value, [0, 1], [1, 0]),
      transform: [
        {
          translateY: interpolate(loadingProgress.value, [0, 1], [0, -20]),
        },
        {
          scale: interpolate(loadingProgress.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loadingProgress.value, [0, 1], [1, 0]),
      transform: [
        {
          translateY: interpolate(loadingProgress.value, [0, 1], [0, 40]),
        },
        {
          scale: interpolate(loadingProgress.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(1000)}>
      <View style={styles.content}>
        {/* Loading State */}
        <Animated.View style={[styles.contentOverlay, loadingContentStyle]}>
          <Animated.View style={[iconStyle]}>
            <AnimatedIcon
              name={
                currentMessage === "Calculando tus resultados."
                  ? "sparkle"
                  : currentMessage === "Analizando tus respuestas."
                    ? "asterisk"
                    : "gearshape"
              }
              namingScheme="sfSymbol"
              size={60}
              color={currentTextColor.value}
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(300).duration(800)}>
            <AnimatedHeading
              level={2}
              style={[textStyle, messageStyle, { textAlign: "center" }]}
            >
              {currentMessage}
            </AnimatedHeading>
          </Animated.View>
          {/* <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <Paragraph color="secondary">
              Por favor, espera un momento.
            </Paragraph>
          </Animated.View> */}
        </Animated.View>

        {/* Success State */}
        <Animated.View style={[styles.contentOverlay, successContentStyle]}>
          <Animated.View entering={ZoomIn.delay(200).duration(600)}>
            <Heading level={2}>¡Listo! </Heading>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <Paragraph color="secondary">
              Continúa para ver tus carreras recomendadas.
            </Paragraph>
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <Button
          onPress={() => {
            const session = getSessionInfo();
            analytics.quizResultsContinue({
              quizSessionId: session.quizSessionId,
            });
            router.push("/(app)/(tabs)/careers");
          }}
          style={{ width: "100%" }}
          title="Continuar"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.gap(2),
    padding: theme.gap(4),
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  contentOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(1),
  },
  buttonContainer: {
    width: "100%",
  },
}));
