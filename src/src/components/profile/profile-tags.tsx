import Tag from "@/components/ui/tag";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Skeleton from "../ui/skeleton";

type ProfileTagsProps = {
  items: string[];
  size?: "sm" | "base";
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};

function ProfileTagsComponent({
  items,
  size = "sm",
  style,
  loading = false,
}: ProfileTagsProps) {
  if (!items?.length) return null;

  const MAX_VISIBLE = 4;
  const visible = items.slice(0, MAX_VISIBLE);
  const remaining = Math.max(items.length - visible.length, 0);

  if (loading) return <Skeleton style={{ width: 100, height: 32 }} />;

  return (
    <View style={[styles.container, style]}>
      {visible.map((item, idx) => (
        <Tag key={`${item}-${idx}`} size={size} capitalize>
          {item}
        </Tag>
      ))}
      {remaining > 0 && <Tag size={size}>{`+${remaining}`}</Tag>}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.gap(0.5),
    justifyContent: "center",
  },
}));

export default ProfileTagsComponent;
