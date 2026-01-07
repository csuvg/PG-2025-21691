import Tag from "@/components/ui/tag";
import { useQuestionTimer } from "@/hooks/use-question-timer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ReadingLinkProps {
  title: string;
  block: string;
  accent: string;
}

export default function ReadingLink({
  title,
  block,
  accent,
}: ReadingLinkProps) {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { isTimeUp } = useQuestionTimer();
  const preview =
    block
      .replace(/\*\*|\*/g, "")
      .split("\n")
      .filter(Boolean)
      .slice(0, 2)
      .join(" ")
      .slice(0, 110)
      .trim() + (block.length > 110 ? "…" : "");

  const handlePress = () => {
    if (isTimeUp) {
      return; // Do nothing when time is up
    }

    router.push({
      pathname: "/reading",
      params: { title, block },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.link,
        isTimeUp && styles.linkDisabled,
        !isTimeUp && pressed && { opacity: 0.8 },
      ]}
      onPress={handlePress}
      hitSlop={10}
      disabled={isTimeUp}
      accessibilityRole="button"
      accessibilityLabel={`Leer texto: ${title}`}
    >
      <Ionicons
        name="document-text-outline"
        style={[
          styles.linkIcon,
          { color: isTimeUp ? theme.colors.neutral[400] : accent },
          isTimeUp && styles.linkIconDisabled,
        ]}
        size={20}
      />
      <View style={{ flex: 1, gap: theme.gap(0.5) }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.gap(0.75),
          }}
        >
          <Text style={[styles.linkTitle, isTimeUp && styles.linkTextDisabled]}>
            {title}
          </Text>
          <Tag variant="none" size="sm">
            Texto
          </Tag>
        </View>
        <Text
          style={[styles.linkSubtitle, isTimeUp && styles.linkTextDisabled]}
        >
          Ingresa para leer el texto y responder la pregunta
        </Text>
        {/* {preview ? (
          <Text
            style={[styles.linkPreview, isTimeUp && styles.linkTextDisabled]}
          >
            "{preview}"
          </Text>
        ) : null} */}
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={
          isTimeUp ? theme.colors.neutral[400] : theme.colors.textSecondary
        }
        style={styles.linkIconForward}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1.25),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
  },
  linkDisabled: {
    opacity: 0.5,
  },
  linkTitle: {
    color: theme.colors.textPrimary,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  linkSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  linkPreview: {
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    fontStyle: "italic",
  },
  linkTextDisabled: {
    color: theme.colors.neutral[400],
  },
  linkIcon: {
    size: 24,
    flexShrink: 0,
    color: theme.colors.textSecondary,
  },
  linkIconDisabled: {
    color: theme.colors.neutral[400],
  },
  linkIconForward: {
    size: 16,
    color: theme.colors.textSecondary,
  },
}));
