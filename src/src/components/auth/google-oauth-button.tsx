import { Image, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GoogleOAuthButton({
  onPress,
}: {
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    "worklet";
    opacity.value = withSpring(0.8, SPRING_CONFIG);
    scale.value = withSpring(0.96, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    "worklet";
    opacity.value = withSpring(1, SPRING_CONFIG);
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image
        source={require("@assets/images/google.png")}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>Continuar con Google</Text>
    </AnimatedPressable>
  );
}

export const styles = StyleSheet.create(theme => ({
  button: {
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1.5),
    borderRadius: theme.radius["full"],
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.gap(1),
  },
  buttonText: {
    color: "black",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
}));
