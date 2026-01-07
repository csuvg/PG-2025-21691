import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export default function Divider({ height = 1 }: { height?: number }) {
  const { theme } = useUnistyles();
  return (
    <View
      style={{
        height: height * 1.25,
        backgroundColor: theme.colors.border,
        marginVertical: theme.gap(1),
      }}
    />
  );
}
