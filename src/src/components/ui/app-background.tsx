import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { useUnistyles, withUnistyles } from "react-native-unistyles";

const ThemedLinearGradient = withUnistyles(LinearGradient, (theme, rt) => ({
  colors: [
    theme.colors.background,
    rt.colorScheme === "dark"
      ? theme.colors.neutral[900]
      : theme.colors.neutral[200],
  ] as const,
}));

export default function AppBackground() {
  const { theme, rt } = useUnistyles();

  return (
    <ThemedLinearGradient
      pointerEvents="none"
      locations={[0, 1]}
      style={StyleSheet.absoluteFillObject}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
  );
}
