import { Icon } from "@roninoss/icons";
import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement, forwardRef, isValidElement } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type FormInputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
  inGroup?: boolean; // set by FormGroup to drop per-row borders/background
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>; // kept for compatibility, applies to value text
  labelStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<ViewStyle>; // applied to the inner pressable container
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const FormInput = forwardRef<View, FormInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onPress,
      disabled = false,
      inGroup = false,
      style,
      inputStyle,
      labelStyle,
      rowStyle,
      error,
      left,
      right,
    },
    ref
  ) => {
    const { theme } = useUnistyles();

    return (
      <View style={[style, { gap: theme.gap(0.33) }]}>
        <Pressable
          ref={ref}
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.container,
            inGroup && styles.containerInGroup,
            error && { borderColor: theme.colors.danger },
            pressed && { opacity: 0.85 },
            rowStyle,
          ]}
        >
          {left}
          <Text style={[styles.label, labelStyle]} numberOfLines={1}>
            {label}
          </Text>
          <Text numberOfLines={1} style={[styles.input, inputStyle]}>
            {value && value.length > 0 ? value : (placeholder ?? "")}
          </Text>
          {right !== undefined ? (
            right
          ) : (
            <Icon
              name="pencil"
              namingScheme="sfSymbol"
              size={18}
              color={theme.colors.dimmed}
            />
          )}
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

export const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1.25),
    borderRadius: theme.radius.xl,
  },
  containerInGroup: {
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  label: {
    color: theme.colors.textPrimary,
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 17,
    flexShrink: 1,
  },
  input: {
    flex: 1,
    padding: 0,
    textAlign: "right",
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.gap(0.5),
    fontFamily: "Inter_500Medium",
  },
}));

type FormGroupProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  separatorColor?: string;
  separatorInset?: number;
  separatorWidthPercent?: number; // e.g., 80 for 80%
};

export function FormGroup({
  children,
  style,
  separatorColor,
  separatorWidthPercent,
}: FormGroupProps) {
  const { theme, rt } = useUnistyles();
  const items = Children.toArray(children).filter(Boolean);

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.xl,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {items.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        const radiusStyle: ViewStyle = {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        };
        const percent =
          typeof separatorWidthPercent === "number"
            ? Math.max(0, Math.min(100, separatorWidthPercent))
            : 90;
        const side = (100 - percent) / 2;

        if (isValidElement(child)) {
          const element = child as ReactElement<any>;
          const isFormInput =
            element.type === FormInput ||
            (element.type as any)?.displayName === "FormInput";

          if (isFormInput) {
            const cloned = cloneElement(element, {
              inGroup: true,
              rowStyle: [element.props?.rowStyle, radiusStyle],
            });

            return (
              <View key={`row-${index}`}>
                {cloned}
                {!isLast ? (
                  <View
                    style={{
                      height: StyleSheet.hairlineWidth,
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ flex: side }} />
                    <View
                      style={{
                        flex: percent,
                        backgroundColor:
                          separatorColor ?? theme.colors.neutral[500],
                      }}
                    />
                    <View style={{ flex: side }} />
                  </View>
                ) : null}
              </View>
            );
          }
        }

        return (
          <View key={`row-${index}`}>
            {child}
            {!isLast ? (
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: side }} />
                <View
                  style={{
                    flex: percent,
                    backgroundColor:
                      rt.colorScheme === "dark"
                        ? theme.colors.neutral[400]
                        : theme.colors.neutral[700],
                  }}
                />
                <View style={{ flex: side }} />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
