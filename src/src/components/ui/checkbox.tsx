import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: ReactNode;
  error?: string;
  disabled?: boolean;
}

export default function Checkbox({
  value,
  onValueChange,
  label,
  error,
  disabled = false,
}: CheckboxProps) {
  const { theme } = useUnistyles();

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.checkboxRow}>
        <Pressable
          onPress={() => !disabled && onValueChange(!value)}
          style={[
            styles.checkboxBox,
            value && {
              backgroundColor: theme.colors.tint,
              borderColor: theme.colors.tint,
            },
            disabled && styles.disabled,
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: value }}
          disabled={disabled}
        >
          {value ? <Feather name="check" size={12} color="black" /> : null}
        </Pressable>
        {label ? (
          <Text style={[styles.checkboxLabel, disabled && styles.disabledText]}>
            {label}
          </Text>
        ) : null}
      </View>
      {error ? <Text style={styles.checkboxError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  checkboxLabel: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  checkboxError: {
    color: theme.colors.danger,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
}));
