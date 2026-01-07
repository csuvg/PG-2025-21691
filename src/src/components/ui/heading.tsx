import { Text, type StyleProp, type TextStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type HeadingProps = {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  style?: StyleProp<TextStyle>;
  color?: "primary" | "secondary" | "tertiary";
};

export default function Heading({
  children,
  level,
  style,
  color = "primary",
}: HeadingProps) {
  styles.useVariants({
    level: level,
    color: color,
  });

  return <Text style={[styles.heading, style]}>{children}</Text>;
}

const styles = StyleSheet.create(theme => ({
  heading: {
    fontFamily: "InstrumentSans_600SemiBold",
    letterSpacing: -0.2,
    variants: {
      color: {
        primary: {
          color: theme.colors.textPrimary,
        },
        secondary: {
          color: theme.colors.textSecondary,
        },
        tertiary: {
          color: theme.colors.textTertiary,
        },
      },
      level: {
        1: {
          fontSize: 32,
        },
        2: {
          fontSize: 24,
        },
        3: {
          fontSize: 20,
        },
        4: {
          fontSize: 18,
        },
        5: {
          fontSize: 16,
        },
        6: {
          fontSize: 14,
        },
        7: {
          fontSize: 12,
        },
      },
    },
  },
}));
