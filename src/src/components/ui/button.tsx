import * as Haptics from "expo-haptics";
import {
  Pressable,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "chip";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Optimized spring config for button animations
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

export default function Button({
  children = null,
  onPress,
  title,
  icon,
  variant = "primary",
  rounded = "full",
  size = "md",
  disabled = false,
  style,
  textStyle,
  ...props
}: {
  children?: React.ReactNode;
  onPress?: () => void;
  title?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  rounded?: "full" | "lg" | "md" | "sm" | "none";
  size?: "md" | "lg" | "sm";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}) {
  const { theme } = useUnistyles();

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
      onPress={onPress}
      onPressIn={() => {
        Haptics.selectionAsync();
        handlePressIn();
      }}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        styles[variant],
        { borderRadius: theme.radius[rounded] },
        style,
        animatedStyle,
      ]}
    >
      {children || (
        <>
          {icon}
          <Text
            style={[styles.buttonText, styles[`${variant}Text`], textStyle]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

export const styles = StyleSheet.create((theme, rt) => ({
  button: {
    paddingHorizontal: theme.gap(3),
    paddingVertical: theme.gap(1.5),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.gap(1),
    borderWidth: 1,
  },

  primary: {
    backgroundColor: theme.colors.tint,
    borderColor: theme.colors.tint,
  },

  chip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderSubtle,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 13,
  },
  secondary: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.background,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: theme.colors.neutral[300],
  },
  destructive: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  buttonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    fontWeight: "700",
  },

  primaryText: {
    color: rt.colorScheme === "light" ? "white" : "black",
  },
  secondaryText: {
    color: theme.colors.typography,
  },
  outlineText: {
    color: theme.colors.typography,
  },
  destructiveText: {
    color: theme.colors.textPrimary,
  },
}));
