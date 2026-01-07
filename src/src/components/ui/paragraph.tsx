import { StyleProp, TextStyle, type TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ThemedText from "./themed-text";

export default function Paragraph({
  children,
  style,
  size = "base",
  numberOfLines,
  ellipsizeMode,
  color = "primary",
  ...rest
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: "sm" | "base" | "xs";
  color?: "primary" | "secondary" | "tertiary";
} & Pick<TextProps, "numberOfLines" | "ellipsizeMode"> &
  Omit<TextProps, "style" | "children">) {
  styles.useVariants({
    size: size,
    color: color,
  });

  return (
    <ThemedText
      style={[styles.paragraph, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...rest}
    >
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create(theme => ({
  paragraph: {
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    variants: {
      size: {
        sm: {
          fontSize: 14,
        },
        xs: {
          fontSize: 12,
        },
        base: {
          fontSize: 15,
        },
      },
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
    },
  },
}));
