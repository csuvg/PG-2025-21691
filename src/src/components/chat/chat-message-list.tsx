import ThemedText from "@/components/ui/themed-text";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Platform, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { Message } from "./types";

interface ChatMessageListProps {
  messages: Message[];
  isResponding: boolean;
  bottomTabBarHeight: number;
  onClear: () => void;
  listRef?: React.RefObject<FlatList<Message> | null>;
}

export default function ChatMessageList({
  messages,
  isResponding,
  bottomTabBarHeight,
  onClear,
  listRef,
}: ChatMessageListProps) {
  const { theme } = useUnistyles();

  function renderItem({ item }: { item: Message }) {
    const isUser = item.role === "user";
    return (
      <View
        style={[styles.messageRow, isUser ? styles.rowEnd : styles.rowStart]}
      >
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <ThemedText style={[styles.messageText, isUser && styles.userText]}>
            {item.content}
          </ThemedText>
        </View>
      </View>
    );
  }

  // Reverse messages array for inverted FlatList (latest messages at bottom)
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <FlatList
      ref={listRef}
      inverted
      data={reversedMessages}
      contentInsetAdjustmentBehavior="automatic"
      keyExtractor={m => m.id}
      renderItem={renderItem}
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      contentContainerStyle={[
        styles.listContent,
        {
          paddingHorizontal: theme.gap(2),
          // With inverted: paddingTop appears at bottom, paddingBottom appears at top
          paddingTop: bottomTabBarHeight + theme.gap(6), // Space at visual bottom (near tab bar)
          paddingBottom: theme.gap(2), // Space at visual top (near header)
          // With inverted, flex-end aligns content to visual top when few messages
          justifyContent: "flex-end",
        },
      ]}
      ListHeaderComponent={
        isResponding ? (
          <View style={styles.typingRow}>
            <ActivityIndicator color={theme.colors.tint} />
            <ThemedText style={styles.typingText}>
              Assistant is typing…
            </ThemedText>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create(theme => ({
  listContent: {
    flexGrow: 1,
    gap: theme.gap(1.5),
  },
  messageRow: {
    flexDirection: "row",
  },
  rowStart: {
    justifyContent: "flex-start",
  },
  rowEnd: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1.5),
    borderRadius: theme.radius["2xl"],
    borderWidth: 1,
  },
  assistantBubble: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderTopLeftRadius: theme.radius["sm"],
  },
  userBubble: {
    backgroundColor: theme.colors.tint,
    borderColor: theme.colors.tint,
    borderBottomRightRadius: theme.radius["sm"],
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "black",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    paddingHorizontal: theme.gap(1),
    paddingTop: theme.gap(0.5),
  },
  typingText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
}));
