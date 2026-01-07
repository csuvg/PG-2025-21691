import AnimatedProgressBar from "@/components/ui/animated-progress-bar";
import Paragraph from "@/components/ui/paragraph";
import { useQuizStore } from "@/stores/quiz";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface QuizProgressProps {
  accent: string;
}

export default function QuizProgress({ accent }: QuizProgressProps) {
  const { theme } = useUnistyles();
  const step = useQuizStore(state => state.step);
  const questions = useQuizStore(state => state.questions);
  const total = questions.length;
  const progress = step / total;

  return (
    <View style={styles.questionProgressContainer}>
      <View style={styles.questionProgress}>
        <Paragraph
          style={{ fontFamily: "InstrumentSans_400Regular", fontSize: 14 }}
        >
          Pregunta {Math.max(step, 1)}
        </Paragraph>
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
  },
}));
