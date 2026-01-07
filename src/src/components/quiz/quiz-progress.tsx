import AnimatedProgressBar from "@/components/ui/animated-progress-bar";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import Timer from "@/components/ui/timer";
import { SECTION_INTROS } from "@/data/sections.const";
import { useQuestionTimer } from "@/hooks/use-question-timer";
import { useQuizStore } from "@/stores/quiz";
import { useEffect } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useShallow } from "zustand/react/shallow";

interface QuizProgressProps {
  accent: string;
}

export default function QuizProgress({ accent }: QuizProgressProps) {
  const { theme } = useUnistyles();

  const {
    step,
    questionStartTimes,
    startQuestionTimer,
    next,
    questions,
    getCurrentQuestion,
  } = useQuizStore(
    useShallow(state => ({
      step: state.step,
      questionStartTimes: state.questionStartTimes,
      startQuestionTimer: state.startQuestionTimer,
      next: state.next,
      questions: state.questions,
      getCurrentQuestion: state.getCurrentQuestion,
    }))
  );

  const currentQuestion = getCurrentQuestion();

  const { timeRemaining, hasTimeLimit } = useQuestionTimer();

  const total = questions.length;
  const progress = step / total;

  const questionStartTime = currentQuestion
    ? questionStartTimes[currentQuestion.id]
    : undefined;
  const sectionTitle = currentQuestion
    ? (SECTION_INTROS[currentQuestion.section]?.title ??
      currentQuestion.section)
    : "";

  // Start timer when question becomes visible
  useEffect(() => {
    if (currentQuestion && hasTimeLimit && !questionStartTime) {
      startQuestionTimer(currentQuestion.id);
    }
  }, [
    currentQuestion?.id,
    hasTimeLimit,
    questionStartTime,
    startQuestionTimer,
  ]);

  return (
    <View style={styles.questionProgressContainer}>
      <View style={styles.questionProgress}>
        <View>
          <Heading level={5}>{sectionTitle}</Heading>

          <Paragraph
            style={{
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 14,
              lineHeight: 0,
            }}
          >
            Pregunta {Math.max(step, 1)}
          </Paragraph>
        </View>
        {hasTimeLimit && questionStartTime && currentQuestion && (
          <Timer
            timeLimit={timeRemaining}
            key={`${currentQuestion.id}-${questionStartTime}`}
          />
        )}
      </View>
      <AnimatedProgressBar progress={progress} accent={accent} />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  questionProgressContainer: {
    flexDirection: "column",
    paddingVertical: theme.gap(1),
    gap: theme.gap(1),
  },
  questionProgress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));
