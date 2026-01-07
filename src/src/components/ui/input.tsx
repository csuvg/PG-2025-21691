import { forwardRef, useState } from "react";
import {
  TextInput as RNTextInput,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: React.ComponentProps<typeof RNTextInput>["keyboardType"];
  autoCapitalize?: React.ComponentProps<typeof RNTextInput>["autoCapitalize"];
  autoComplete?: React.ComponentProps<typeof RNTextInput>["autoComplete"];
  textContentType?: React.ComponentProps<typeof RNTextInput>["textContentType"];
  returnKeyType?: React.ComponentProps<typeof RNTextInput>["returnKeyType"];
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const Input = forwardRef<RNTextInput, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      secureTextEntry,
      keyboardType,
      autoCapitalize = "none",
      autoComplete,
      textContentType,
      returnKeyType,
      onSubmitEditing,
      style,
      inputStyle,
      error,
      left,
      right,
    },
    ref
  ) => {
    const { theme } = useUnistyles();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[style, { gap: theme.gap(0.33) }]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View
          style={[
            styles.inputContainer,
            isFocused && {
              borderColor: theme.colors.focusRing,
              borderWidth: 1.5,
            },
            error && { borderColor: theme.colors.danger },
          ]}
        >
          {left}
          <RNTextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            textContentType={textContentType}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.input,
              inputStyle,
              { color: theme.colors.textPrimary },
            ]}
          />
          {right}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

Input.displayName = "Input";

export default Input;

export const styles = StyleSheet.create(theme => ({
  label: {
    color: theme.colors.label,
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 13,
    marginBottom: theme.gap(0.5),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1.25),
    borderRadius: theme.radius.lg,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    fontFamily: "InstrumentSans_400Regular",
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.gap(0.5),
    fontFamily: "Inter_500Medium",
  },
}));
