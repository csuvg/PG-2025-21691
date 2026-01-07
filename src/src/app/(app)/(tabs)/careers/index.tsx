import { useResults } from "@/api/career";
import CareerRecommendations from "@/components/career/career-recommendations";
import AppBackground from "@/components/ui/app-background";
import IntroModal from "@/components/ui/intro-modal";
import Paragraph from "@/components/ui/paragraph";
import { ONBOARDING_INTROS } from "@/data/onboarding.const";
import { useOnboardingStore } from "@/stores/onboarding";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Icon } from "@roninoss/icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";

const StyledScrollView = withUnistyles(ScrollView);

export default function Tab() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { seen, markSeen } = useOnboardingStore();
  const [showIntro, setShowIntro] = useState(false);
  const { theme } = useUnistyles();
  const { data: results, isLoading, error } = useResults();

  // No-op: results summary is rendered inline and collapsible
  useEffect(() => {
    if (!seen.careers) setShowIntro(true);
  }, [seen.careers]);

  useEffect(() => {
    console.log("results", JSON.stringify(results, null, 2));
  }, [results]);

  console.log(JSON.stringify(error?.message, null, 2));

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="small" color={theme.colors.tint} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: theme.gap(2),
        }}
      >
        <AppBackground />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: theme.gap(2),
            borderRadius: theme.radius.full,
            padding: theme.gap(2),
            backgroundColor: theme.colors.tintDimmed,
          }}
        >
          <Icon
            name="exclamationmark"
            size={32}
            color={theme.colors.tint}
            namingScheme="sfSymbol"
          />
        </View>
        <Paragraph size="base" color="secondary">
          No pudimos cargar tus recomendaciones.
        </Paragraph>
      </SafeAreaView>
    );
  }

  if (!results || results.results.recommendations.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <AppBackground />
        <Paragraph>No recommendations found</Paragraph>
      </SafeAreaView>
    );
  }

  return (
    <>
      <IntroModal
        visible={showIntro}
        title={ONBOARDING_INTROS.careers.title}
        body={ONBOARDING_INTROS.careers.body}
        onClose={() => {
          markSeen("careers");
          setShowIntro(false);
        }}
      />
      <StyledScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomTabBarHeight + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <AppBackground />
        <CareerRecommendations
          recommendations={results?.results?.recommendations}
        />
      </StyledScrollView>
    </>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  content: {
    // flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.gap(2),
  },
  scrollView: {
    flex: 1,
    // position: "relative",
    backgroundColor: theme.colors.background,
  },
}));
