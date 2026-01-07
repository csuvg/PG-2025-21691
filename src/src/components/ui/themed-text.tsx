import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

export default function ThemedText({
  children,
  style,
  ...rest
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
} & TextProps) {
  const { theme } = useUnistyles();
  return (
    <Text
      {...rest}
      style={[
        { color: theme.colors.typography, fontFamily: "Inter_400Regular" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
