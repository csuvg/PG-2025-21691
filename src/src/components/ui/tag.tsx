import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type TagProps = {
  children: string;
  size?: "sm" | "base";
  variant?: "none" | "outline";
  style?: StyleProp<ViewStyle>;
  capitalize?: boolean;
};

export default function Tag({
  children,
  size = "sm",
  variant = "none",
  style,
  capitalize = false,
}: TagProps) {
  styles.useVariants({
    size,
    variant,
  });

  return (
    <View style={[styles.tag, style]}>
      <Text
        style={[styles.tagText, capitalize && { textTransform: "capitalize" }]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  tag: {
    borderRadius: theme.radius.full,
    borderWidth: 1,
    variants: {
      size: {
        sm: {
          paddingHorizontal: theme.gap(1),
          paddingVertical: theme.gap(0.5),
        },
        base: {
          paddingHorizontal: theme.gap(1.5),
          paddingVertical: theme.gap(0.75),
        },
      },
      variant: {
        none: {
          borderColor: theme.colors.borderSubtle,
          backgroundColor: theme.colors.surface,
        },
        outline: {
          borderColor: theme.colors.border,
          backgroundColor: "transparent",
        },
      },
    },
  },
  tagText: {
    color: theme.colors.textSecondary,
    fontFamily: "InstrumentSans_400Regular",
    variants: {
      size: {
        sm: {
          fontSize: 12,
        },
        base: {
          fontSize: 13,
        },
      },
    },
  },
}));
