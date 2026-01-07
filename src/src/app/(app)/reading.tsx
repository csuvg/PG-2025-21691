import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { useQuestionTimer } from "@/hooks/use-question-timer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";

export default function ReadingScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string; block?: string }>();
  const { isTimeUp } = useQuestionTimer();

  // Redirect back when time is up
  useEffect(() => {
    if (isTimeUp) {
      router.dismiss();
    }
  }, [isTimeUp, router]);

  return (
    <View style={{ flex: 1, padding: theme.gap(2), gap: theme.gap(1) }}>
      <Animated.View
        entering={FadeInUp.springify(500).withInitialValues({ opacity: 0 })}
      >
        <Pressable
          onPress={() => router.dismiss()}
          style={{ alignSelf: "flex-start", paddingVertical: theme.gap(0.5) }}
        >
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: "Inter_500Medium",
              fontSize: 14,
            }}
          >
            Cerrar
          </Text>
        </Pressable>
      </Animated.View>

      {params.title ? (
        <Text
          style={{
            fontFamily: "InstrumentSans_600SemiBold",
            fontSize: 18,
            color: theme.colors.textPrimary,
          }}
        >
          {params.title}
        </Text>
      ) : null}

      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.gap(2) }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <MarkdownRenderer
          content={(params.block as string) ?? ""}
          style={{
            flex: 1,
            gap: theme.gap(1),
          }}
        />
      </ScrollView>
    </View>
  );
}
