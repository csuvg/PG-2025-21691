import type { TrueSheet as TrueSheetType } from "@lodev09/react-native-true-sheet";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Icon } from "@roninoss/icons";
import { forwardRef, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Conversation = {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string; timestamp: number }>;
};

interface ConversationsSheetProps {
  conversations: Record<string, Conversation>;
  currentId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationsSheet = forwardRef<
  TrueSheetType,
  ConversationsSheetProps
>((props, ref) => {
  const {
    conversations,
    currentId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
  } = props;
  const { theme, rt } = useUnistyles();
  const scrollRef = useRef<any>(null);

  const conversationsList = Object.values(conversations).sort((a, b) => {
    const aLastMessage = a.messages[a.messages.length - 1];
    const bLastMessage = b.messages[b.messages.length - 1];
    return (bLastMessage?.timestamp ?? 0) - (aLastMessage?.timestamp ?? 0);
  });

  function getPreview(conv: Conversation): string {
    const lastUserMessage = [...conv.messages]
      .reverse()
      .find(m => m.role === "user");
    if (!lastUserMessage) return "Sin mensajes";
    return (
      lastUserMessage.content.slice(0, 60) +
      (lastUserMessage.content.length > 60 ? "..." : "")
    );
  }

  function getTimestamp(conv: Conversation): string {
    const lastMessage = conv.messages[conv.messages.length - 1];
    if (!lastMessage) return "";

    const now = Date.now();
    const diff = now - lastMessage.timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "ahora";
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours} h`;
    if (days < 7) return `${days} d`;
    return new Date(lastMessage.timestamp).toLocaleDateString();
  }

  return (
    <TrueSheet
      ref={ref}
      sizes={["large"]}
      cornerRadius={16}
      backgroundColor={theme.colors.surface}
      dimmed={true}
      keyboardMode="pan"
      scrollRef={scrollRef}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Conversaciones</Text>
          <Pressable
            onPressIn={onNewConversation}
            style={styles.newButton}
            hitSlop={8}
            android_ripple={{
              color: theme.colors.tintDimmed,
              borderless: false,
              radius: 18,
            }}
          >
            <Icon
              name="plus"
              size={20}
              color={theme.colors.tint}
              namingScheme="sfSymbol"
            />
          </Pressable>
        </View>

        {conversationsList.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name="square.and.pencil"
              size={48}
              color={theme.colors.textSecondary}
              namingScheme="sfSymbol"
            />
            <Text style={styles.emptyText}>Aún no hay conversaciones</Text>
            <Text style={styles.emptySubtext}>
              Crea un chat nuevo para comenzar
            </Text>
          </View>
        ) : (
          conversationsList.map((item, index) => {
            const isActive = item.id === currentId;
            const isFirst = index === 0;
            const isLast = index === conversationsList.length - 1;

            const onDelete = (e: GestureResponderEvent) => {
              e.stopPropagation?.();
              onDeleteConversation(item.id);
            };

            return (
              <View key={item.id}>
                <Pressable
                  onPressIn={() => onSelectConversation(item.id)}
                  style={[
                    styles.conversationItem,
                    isFirst && styles.conversationItemFirst,
                    isLast && styles.conversationItemLast,
                  ]}
                >
                  <View style={styles.leading}>
                    <View
                      style={[
                        styles.leadingCircle,
                        isActive && styles.leadingCircleActive,
                      ]}
                    >
                      {isActive && (
                        <Icon
                          name="checkmark"
                          size={12}
                          color={theme.colors.surface}
                          namingScheme="sfSymbol"
                        />
                      )}
                    </View>
                  </View>
                  <View style={styles.conversationContent}>
                    <Text style={styles.messageText} numberOfLines={1}>
                      {getPreview(item)}
                    </Text>
                    <Text style={styles.timestamp} numberOfLines={1}>
                      {getTimestamp(item)}
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <Pressable
                      onPressIn={onDelete}
                      style={styles.deleteButton}
                      hitSlop={8}
                    >
                      <Icon
                        name="trash"
                        size={18}
                        color={theme.colors.danger}
                        namingScheme="sfSymbol"
                      />
                    </Pressable>
                  </View>
                </Pressable>
                {!isLast && (
                  <View
                    style={{
                      height: StyleSheet.hairlineWidth,
                      backgroundColor:
                        rt.colorScheme === "light"
                          ? theme.colors.neutral[400]
                          : theme.colors.neutral[600],
                      width: "94%",
                      alignSelf: "center",
                    }}
                  />
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </TrueSheet>
  );
});

ConversationsSheet.displayName = "ConversationsSheet";

const styles = StyleSheet.create(theme => ({
  scrollView: {},
  content: {
    paddingHorizontal: theme.gap(2),
    paddingTop: theme.gap(2),
    paddingBottom: theme.gap(2),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: theme.gap(2),
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  newButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.gap(1.25),
    paddingRight: theme.gap(1.5),
    paddingLeft: theme.gap(1),
    backgroundColor: theme.colors.surfaceElevated,
    gap: theme.gap(1.25),
  },
  conversationItemFirst: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  conversationItemLast: {
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderBottomWidth: 0,
  },
  leading: {
    width: 24,
    alignItems: "center",
  },
  leadingCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  leadingCircleActive: {
    backgroundColor: theme.colors.tint,
    borderColor: theme.colors.tint,
  },
  conversationContent: {
    flex: 1,
    gap: theme.gap(0.25),
  },
  messageText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: theme.colors.textTertiary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  deleteButton: {
    padding: theme.gap(0.5),
    borderRadius: theme.radius.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.gap(8),
    gap: theme.gap(1),
  },
  emptyText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: theme.colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: theme.colors.textSecondary,
  },
}));
