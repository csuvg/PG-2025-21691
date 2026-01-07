import {
  useGenerateWhatIfContent,
  useGenerateWhatIfQuestion,
} from "@/api/career";
import GradientBorderButton from "@/components/career/gradient-border-button";
import WhatIfContent from "@/components/career/what-if-content";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Icon } from "@roninoss/icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";

const StyledIcon = withUnistyles(Icon, (theme, rt) => ({
  color: theme.colors.textPrimary,
}));

const AnimatedIcon = Animated.createAnimatedComponent(StyledIcon);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);

export default function WhatIf() {
  const params = useLocalSearchParams<{
    question: string;
    newCareerId: string;
  }>();

  const question = Array.isArray(params.question)
    ? params.question[0]
    : params.question;
  const newCareerId = Array.isArray(params.newCareerId)
    ? params.newCareerId[0]
    : params.newCareerId;

  const { theme } = useUnistyles();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { data: content, isLoading: generatingContent } =
    useGenerateWhatIfContent(question);

  // Generate the next "what if" question using the new career ID
  const { data: nextWhatIf } = useGenerateWhatIfQuestion(newCareerId);

  const appear = useSharedValue(0);

  useEffect(() => {
    appear.value = withTiming(1, {
      duration: 1250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [
      { translateY: (1 - appear.value) * -20 },
      { rotate: `${appear.value * 90}deg` },
    ],
  }));

  const headingStyle = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{ translateY: (1 - appear.value) * -20 }],
  }));

  function handleNextWhatIf() {
    if (!nextWhatIf?.completeQuestion || !nextWhatIf?.newCareerId) return;

    router.push({
      pathname: "/(app)/(tabs)/careers/what-if",
      params: {
        question: nextWhatIf.completeQuestion,
        newCareerId: nextWhatIf.newCareerId,
      },
    });
  }

  function handleChatAboutThis() {
    if (!question) return;
    const prompt = `Hablemos sobre: ${question}`;
    router.push({
      pathname: "/(app)/(tabs)/chat",
      params: { initialPrompt: prompt },
    });
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottomTabBarHeight + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerBlurEffect: "regular",
          title: "",
          headerBackTitle: "Atrás",
        }}
      />

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Animated.View style={iconStyle}>
            <AnimatedIcon name="star-four-points" size={64} />
          </Animated.View>
          <AnimatedHeading level={2} style={[styles.title, headingStyle]}>
            {question}
          </AnimatedHeading>
        </View>

        <WhatIfContent
          content={content?.mini_inform}
          isLoading={generatingContent}
        />

        {!generatingContent && nextWhatIf?.shortQuestion && (
          <View style={{ gap: 4, width: "100%", alignSelf: "stretch" }}>
            <Button
              onPress={handleChatAboutThis}
              style={[styles.actionButton, { width: "100%" }]}
              variant="secondary"
              title="Consultar en Chat"
              icon={
                <Icon
                  name="message"
                  size={20}
                  color={theme.colors.textPrimary}
                />
              }
            />
            <Animated.View
              entering={FadeInUp.duration(1000).delay(800).springify()}
              style={{ width: "100%" }}
            >
              <GradientBorderButton
                title={nextWhatIf.shortQuestion}
                onPress={handleNextWhatIf}
                disableEffect={false}
              />
            </Animated.View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.gap(3),
  },
  actionButton: {
    backgroundColor: theme.colors.surface,
  },
  content: {
    gap: theme.gap(3),
    alignItems: "center",
    flex: 1,
  },
  titleSection: {
    alignItems: "center",
    gap: theme.gap(2),
  },
  title: {
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
}));
