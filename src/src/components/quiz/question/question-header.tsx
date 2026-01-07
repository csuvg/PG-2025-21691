import Heading from "@/components/ui/heading";
import ImagePreview from "@/components/ui/image-preview";
import Paragraph from "@/components/ui/paragraph";
import { Question } from "@/stores/quiz";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";

interface QuestionHeaderProps {
  currentQuestion: Question;
}

export default function QuestionHeader({
  currentQuestion,
}: QuestionHeaderProps) {
  const { theme } = useUnistyles();

  return (
    <Animated.View key={currentQuestion.id} style={{ gap: theme.gap(0.25) }}>
      {currentQuestion.meta?.imageUrl ? (
        <ImagePreview
          imageUrl={currentQuestion.meta.imageUrl}
          style={{
            width: "60%",
            marginHorizontal: "auto",
            height: 150,
            marginBottom: theme.gap(4),
            borderRadius: theme.radius.lg,
          }}
          contentFit="cover"
        />
      ) : null}
      <Animated.View
        entering={FadeInRight.springify(700).withInitialValues({
          transform: [{ translateX: 100 }],
          opacity: 0,
        })}
      >
        <Heading level={getHeaderLevel(currentQuestion.prompt)}>
          {currentQuestion.prompt}
        </Heading>
      </Animated.View>

      <Animated.View
        entering={FadeInRight.springify(700)
          .delay(100)
          .withInitialValues({
            transform: [{ translateX: 40 }],
            opacity: 0,
          })}
      >
        <Paragraph
          style={{
            color: theme.colors.textSecondary,
          }}
        >
          {getQuestionDescription(currentQuestion, currentQuestion.meta)}
        </Paragraph>
      </Animated.View>
    </Animated.View>
  );
}

function getHeaderLevel(title: string) {
  if (title.length > 100) return 4;
  if (title.length > 75) return 3;
  if (title.length > 50) return 2;
  return 2;
}

function getQuestionDescription(
  question: Question,
  meta?: Record<string, any>
) {
  switch (question.type) {
    case "multi":
      return "Puedes seleccionar una o varias opciones";
    case "number":
      const min = meta?.min;
      const max = meta?.max;
      const unit = meta?.unit;
      if (min !== undefined && max !== undefined) {
        return `Ingresa un valor entre ${min} y ${max}${unit ? " " + unit : ""}`;
      }
      return "Ingresa un valor numérico";
    case "compound":
      return "Ingresa un valor numérico";
    case "matrix":
      return "Selecciona una sola respuesta";
    case "text":
      return "Ingresa un valor numérico";
    case "boolean":
      return "Selecciona una sola respuesta";
    default:
      return "Selecciona una sola respuesta";
  }
}
