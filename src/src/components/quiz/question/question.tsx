import { useSubmitQuiz } from "@/api/quiz";
import PreQuizScreen from "@/components/quiz/pre-quiz-screen";
import QuestionActions from "@/components/quiz/question/question-actions";
import QuestionHeader from "@/components/quiz/question/question-header";
import QuestionOptions from "@/components/quiz/question/question-options";
import QuizProgress from "@/components/quiz/quiz-progress";
import SectionIntro from "@/components/quiz/section-intro";
import { SECTION_INTROS } from "@/data/sections.const";
import { useAnalytics } from "@/hooks/use-analytics";
import useSectionColor from "@/hooks/use-section-color";
import { useQuizStore } from "@/stores/quiz";
import { isAnswerValid } from "@/utils/quiz-validation";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ResultsScreen from "../results-screen";

export default function Question() {
  const { theme } = useUnistyles();
  const analytics = useAnalytics();
  const {
    step,
    setAnswer,
    toggleMulti,
    answers,
    next,
    prev,
    questions,
    getCurrentQuestion,
    markQuestionViewed,
    beginSession,
    getSessionInfo,
  } = useQuizStore();

  const currentQuestion = getCurrentQuestion();

  const { mutateAsync: submitQuiz, isPending: calculatingResults } =
    useSubmitQuiz();

  const insets = useSafeAreaInsets();

  const accent = useSectionColor(currentQuestion?.section || "");
  const selected = currentQuestion ? answers[currentQuestion.id] : undefined;

  const isAnswered =
    step !== 0 &&
    currentQuestion &&
    selected !== undefined &&
    isAnswerValid(currentQuestion, selected);

  const onLastQuestion = step === questions.length;
  const [showingResults, setShowingResults] = useState(false);

  // Start a new quiz session and move to first question
  function handleStart() {
    const sessionId = beginSession();
    analytics.quizSessionStarted({
      quizSessionId: sessionId,
      totalQuestions: questions.length,
    });
    next();
  }

  function handleNext() {
    if (onLastQuestion) {
      // track last answer and quiz finish
      const session = getSessionInfo();
      if (currentQuestion) {
        const startTimes = (useQuizStore.getState() as any)
          .questionStartTimes as Record<string, number>;
        const startedAt = startTimes[currentQuestion.id];
        const durationSec = startedAt
          ? (Date.now() - startedAt) / 1000
          : undefined;
        analytics.quizQuestionAnswered({
          quizSessionId: session.quizSessionId,
          questionId: currentQuestion.id,
          type: currentQuestion.type,
          durationSec,
        });
      }
      analytics.quizFinished({
        quizSessionId: session.quizSessionId,
        totalDurationSec: session.quizStartedAt
          ? (Date.now() - session.quizStartedAt) / 1000
          : undefined,
      });
      setShowingResults(true);
      submitQuiz(answers, {
        onSuccess: data => {
          analytics.quizCompleted(new Date());
        },
        onError: error => {
          console.log("Error submitting quiz", error.message);
        },
      });
    } else {
      const session = getSessionInfo();
      if (currentQuestion) {
        const startTimes = (useQuizStore.getState() as any)
          .questionStartTimes as Record<string, number>;
        const startedAt = startTimes[currentQuestion.id];
        const durationSec = startedAt
          ? (Date.now() - startedAt) / 1000
          : undefined;
        analytics.quizQuestionAnswered({
          quizSessionId: session.quizSessionId,
          questionId: currentQuestion.id,
          type: currentQuestion.type,
          durationSec,
        });
      }
      analytics.quizNavigate("next", {
        quizSessionId: session.quizSessionId,
      });
      next();
    }
  }

  // Show section intro screen when entering a new section for the first time
  const {
    shownSectionIntros,
    markSectionIntroSeen,
    clearQuestionTimer,
    startQuestionTimer,
  } = useQuizStore.getState() as any;
  const sectionId = currentQuestion?.section;
  const introCopy = sectionId ? SECTION_INTROS[sectionId] : undefined;
  const shouldShowIntro =
    introCopy && sectionId && !shownSectionIntros?.[sectionId];

  // Ensure the timer is not running while the intro screen is visible
  useEffect(() => {
    if (shouldShowIntro && currentQuestion?.meta?.timeLimitInSeconds) {
      clearQuestionTimer(currentQuestion.id);
    }
  }, [shouldShowIntro, currentQuestion?.id]);

  // Track question viewed and set a start timestamp on first view
  useEffect(() => {
    if (!currentQuestion || shouldShowIntro) return;
    const session = getSessionInfo();
    analytics.quizQuestionViewed({
      quizSessionId: session.quizSessionId,
      questionId: currentQuestion.id,
      type: currentQuestion.type,
    });
    markQuestionViewed(currentQuestion.id);
  }, [currentQuestion?.id, shouldShowIntro]);

  if (step === 0) {
    return <PreQuizScreen onStart={handleStart} />;
  }

  if (!currentQuestion) {
    return null;
  }

  if (shouldShowIntro) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={insets.top}
        >
          <Animated.View style={styles.container}>
            {/* <QuizProgress accent={accent} /> */}
            <SectionIntro
              title={introCopy.title}
              subtitle={introCopy.subtitle}
              accent={accent}
              onContinue={() => {
                markSectionIntroSeen(sectionId);
                // Start timer now that the user begins the question after reading the intro
                if (currentQuestion?.meta?.timeLimitInSeconds) {
                  startQuestionTimer(currentQuestion.id);
                }
              }}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        {showingResults ? (
          <ResultsScreen loading={calculatingResults} />
        ) : (
          <Animated.View
            style={styles.container}
            exiting={FadeOut.duration(750)}
          >
            <QuizProgress accent={accent} />
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                gap: theme.gap(2.5),
                paddingBottom: theme.gap(4),
                flexGrow: 1,
                justifyContent: "center",
              }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === "ios" ? "interactive" : "on-drag"
              }
              showsVerticalScrollIndicator={false}
            >
              <QuestionHeader currentQuestion={currentQuestion} />
              <QuestionOptions
                currentQuestion={currentQuestion}
                selected={selected}
                onToggleMulti={toggleMulti}
                onSetAnswer={setAnswer}
                accent={accent}
              />
            </ScrollView>
            <QuestionActions
              onNext={handleNext}
              onPrev={prev}
              accent={accent}
              isLastQuestion={onLastQuestion}
              isAnswered={Boolean(isAnswered)}
              currentType={currentQuestion.type}
            />
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.gap(2),
    gap: theme.gap(2),
    justifyContent: "space-between",
  },
}));
