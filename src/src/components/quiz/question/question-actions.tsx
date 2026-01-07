import Button from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";
import { useQuizStore, type Question } from "@/stores/quiz";
import Animated, { FadeIn } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { toast } from "sonner-native";

interface QuestionActionsProps {
  onNext: () => void;
  onPrev: () => void;
  accent: string;
  isAnswered: boolean;
  isLastQuestion: boolean;
  currentType: Question["type"];
}

export default function QuestionActions({
  onNext,
  onPrev,
  accent,
  isAnswered,
  isLastQuestion,
  currentType,
}: QuestionActionsProps) {
  const { theme } = useUnistyles();

  const { step, getSessionInfo } = useQuizStore();
  const analytics = useAnalytics();

  const handleNext = () => {
    if (!isAnswered) {
      if (currentType === "matrix") {
        toast.error(
          "Debes seleccionar una opción en cada fila antes de continuar"
        );
      } else {
        toast.error("Debes seleccionar una respuesta antes de continuar");
      }
      return;
    }
    onNext();
  };

  return (
    <Animated.View style={{ gap: theme.gap(1) }} entering={FadeIn}>
      <Animated.View style={{ opacity: isAnswered ? 1 : 0.5 }}>
        <Button
          title={isLastQuestion ? "Finalizar" : "Siguiente"}
          onPress={handleNext}
          disabled={!isAnswered}
          style={{
            marginTop: theme.gap(3),
            backgroundColor: accent,
            borderColor: accent,
          }}
        />
      </Animated.View>
      {step > 1 && (
        <Button
          title="Regresar"
          onPress={() => {
            const session = getSessionInfo();
            analytics.quizNavigate("prev", {
              quizSessionId: session.quizSessionId,
            });
            onPrev();
          }}
          variant="outline"
        />
      )}
    </Animated.View>
  );
}
