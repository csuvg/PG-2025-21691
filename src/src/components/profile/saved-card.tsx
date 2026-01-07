import Heading from "@/components/ui/heading";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type SavedCardProps = {
  id: string;
  title: string;
  accentColor: string;
  likedAt: string; // ISO date
  onPress?: () => void;
};

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) {
    const mins = Math.max(1, Math.floor(diffMs / minute));
    return `${mins} min`;
  }
  if (diffMs < day) {
    const hrs = Math.floor(diffMs / hour);
    return `${hrs} h`;
  }
  const days = Math.floor(diffMs / day);
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `${days} días`;
  return date.toLocaleDateString();
}

export default function SavedCard({
  id,
  title,
  accentColor,
  likedAt,
  onPress,
}: SavedCardProps) {
  const { theme } = useUnistyles();
  const cardRadius = theme.radius.lg;
  const cardPadding = theme.gap(0.5);
  const innerCardRadius = cardRadius - cardPadding;
  return (
    <Pressable onPress={onPress} style={styles.cardOuter}>
      <View style={styles.cardMiddle}>
        <View
          style={[
            styles.cardInner,
            { borderColor: accentColor, borderRadius: innerCardRadius },
          ]}
        >
          <LinearGradient
            colors={[accentColor, theme.colors.background]}
            start={{ x: 0, y: -2 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
          <View style={styles.innerContent}>
            <Heading level={6} style={{ color: theme.colors.typography }}>
              {title}
            </Heading>
            <Text style={styles.meta}>{formatRelativeDate(likedAt)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  cardOuter: {
    flex: 1,
    borderRadius: theme.radius["lg"],
    borderWidth: rt.colorScheme === "dark" ? 0.5 : 0,
    borderColor:
      rt.colorScheme === "dark"
        ? theme.colors.neutral[800]
        : theme.colors.neutral[300],
    backgroundColor: theme.colors.surface,
    // padding: theme.gap(0.5),
  },
  cardMiddle: {
    flex: 1,
    borderRadius: theme.radius["lg"],
    borderWidth: 0.5,
    borderColor: theme.colors.borderSubtle,
    padding: theme.gap(0.5),
  },
  cardInner: {
    flex: 1,
    borderRadius: theme.radius["md"],
    borderWidth: 0,
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerContent: {
    position: "absolute",
    left: theme.gap(0.75),
    right: theme.gap(0.75),
    bottom: theme.gap(0.75),
  },

  meta: {
    marginTop: theme.gap(0.25),
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
}));
