import { useProfile } from "@/api/profile";
import { useQuiz } from "@/api/quiz";
import Question from "@/components/quiz/question/question";
import AppBackground from "@/components/ui/app-background";
import GradientBackground from "@/components/ui/gradient-background";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import useSectionColor from "@/hooks/use-section-color";
import { useQuizStore } from "@/stores/quiz";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";

const DEBUG = false;

export default function App() {
  const { theme } = useUnistyles();

  if (DEBUG) {
    return <Redirect href="/(app)/(tabs)/careers" />;
  }
  const router = useRouter();

  const { isLoading: profileLoading, data: profileData } = useProfile();

  const { step, setQuestions, getCurrentQuestion, reset } = useQuizStore();
  const currentQuestion = getCurrentQuestion();
  const sectionColor = useSectionColor(currentQuestion?.section || "");

  const {
    data: quizData,
    isLoading: questionsLoading,
    error: quizError,
  } = useQuiz();

  useEffect(() => {
    reset();
    if (quizData && Array.isArray(quizData)) {
      setQuestions(quizData);
    }
  }, [quizData, setQuestions]);

  if (profileLoading || questionsLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <AppBackground />
        <ActivityIndicator size="small" color={theme.colors.tint} />
      </SafeAreaView>
    );
  }

  if (!profileLoading && profileData?.user?.quizCompletedAt) {
    return <Redirect href="/(app)/(tabs)/careers" />;
  }

  if (quizError) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <AppBackground />
        <View style={{ padding: 20 }}>
          <Heading level={1}>Error</Heading>
          <Paragraph>
            No pudimos cargar el cuestionario, intenta nuevamente.
          </Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {step === 0 ? (
        <AppBackground />
      ) : (
        <GradientBackground accent={sectionColor} />
      )}
      <Question />
    </View>
  );
}
