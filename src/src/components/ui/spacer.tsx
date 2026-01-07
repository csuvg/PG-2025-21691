import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export default function Spacer() {
  const { theme } = useUnistyles();

  return <View style={{ marginVertical: theme.gap(1) }} />;
}
