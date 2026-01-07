import ChoiceRow from "@/components/quiz/choice-row";
import ReadingLink from "@/components/quiz/reading-link";
import Input from "@/components/ui/input";
import { AnswerValue, MultiAnswerValue, Question } from "@/stores/quiz";
import { getAnswerSchemaForQuestion } from "@/utils/quiz-validation";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";

interface QuestionOptionsProps {
  currentQuestion: Question;
  selected: AnswerValue | MultiAnswerValue | undefined;
  onToggleMulti: (questionId: string, optionId: string) => void;
  onSetAnswer: (questionId: string, value: AnswerValue) => void;
  accent: string;
}

export default function QuestionOptions({
  currentQuestion,
  selected,
  onToggleMulti,
  onSetAnswer,
  accent,
}: QuestionOptionsProps) {
  const { theme } = useUnistyles();

  if (currentQuestion.type === "number") {
    const min = currentQuestion.meta?.min as number | undefined;
    const max = currentQuestion.meta?.max as number | undefined;
    const unit = currentQuestion.meta?.unit as string | undefined;

    const valueStr =
      typeof selected === "number"
        ? String(selected)
        : typeof selected === "string"
          ? selected
          : "";

    const schema = getAnswerSchemaForQuestion(currentQuestion);
    let error: string | undefined;
    if (valueStr.length > 0) {
      const result = schema.safeParse(valueStr);
      if (!result.success) {
        error = result.error.issues[0]?.message || "Valor inválido";
      }
    }

    return (
      <View style={{ gap: theme.gap(1), marginTop: theme.gap(2) }}>
        {currentQuestion.meta?.block ? (
          <ReadingLink
            title={currentQuestion.meta.title}
            block={String(currentQuestion.meta.block)}
            accent={accent}
          />
        ) : null}
        <Animated.View>
          <Input
            placeholder={`0`}
            keyboardType="numeric"
            value={valueStr}
            onChangeText={text => onSetAnswer(currentQuestion.id, text)}
            right={
              unit ? (
                <Text style={{ color: theme.colors.textSecondary }}>
                  {unit}
                </Text>
              ) : undefined
            }
            error={error}
          />
        </Animated.View>
      </View>
    );
  }

  if (currentQuestion.type === "time") {
    const valueStr = typeof selected === "string" ? selected : "";
    const schema = getAnswerSchemaForQuestion(currentQuestion);
    let error: string | undefined;
    if (valueStr.length > 0) {
      const result = schema.safeParse(valueStr);
      if (!result.success) error = result.error.issues[0]?.message;
    }

    return (
      <View style={{ gap: theme.gap(1) }}>
        {currentQuestion.meta?.block ? (
          <ReadingLink
            title={currentQuestion.meta.title}
            block={String(currentQuestion.meta.block)}
            accent={accent}
          />
        ) : null}
        <Animated.View key={currentQuestion.id} entering={FadeIn.duration(500)}>
          <Input
            placeholder={"11:00"}
            keyboardType="numbers-and-punctuation"
            value={valueStr}
            onChangeText={text => onSetAnswer(currentQuestion.id, text)}
            right={
              <Text style={{ color: theme.colors.textSecondary }}>24h</Text>
            }
            error={error}
          />
        </Animated.View>
      </View>
    );
  }

  if (currentQuestion.type === "matrix") {
    const rows =
      (currentQuestion.meta?.rows as Array<{ id: string; label: string }>) ||
      [];
    const cols = currentQuestion.options;
    const valueRecord =
      selected && typeof selected === "object" && !Array.isArray(selected)
        ? (selected as Record<string, string | number>)
        : ({} as Record<string, string | number>);

    return (
      <>
        {currentQuestion.meta?.block ? (
          <ReadingLink
            title={currentQuestion.meta.title}
            block={String(currentQuestion.meta.block)}
            accent={accent}
          />
        ) : null}
        <Animated.View
          style={{ gap: theme.gap(2) }}
          key={currentQuestion.id}
          entering={FadeIn.duration(500)}
        >
          {rows.map(row => (
            <View
              key={`${currentQuestion.id}-${row.id}`}
              style={{ gap: theme.gap(1) }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 15,
                  color: theme.colors.textPrimary,
                }}
              >
                {row.label}
              </Text>
              <View style={{ flexDirection: "row", gap: theme.gap(0.75) }}>
                {cols.map(col => {
                  const selectedCol = valueRecord[row.id] === col.id;
                  return (
                    <View key={`${row.id}-${col.id}`}>
                      <Pressable
                        onPress={() =>
                          onSetAnswer(currentQuestion.id, {
                            ...valueRecord,
                            [row.id]: col.id,
                          })
                        }
                        style={({ pressed }: { pressed: boolean }) => [
                          {
                            borderWidth: 1,
                            borderColor: selectedCol
                              ? accent
                              : theme.colors.borderSubtle,
                            backgroundColor: theme.colors.surface,
                            paddingHorizontal: theme.gap(1.25),
                            paddingVertical: theme.gap(0.75),
                            borderRadius: theme.radius.xl,
                          },
                          pressed && { opacity: 0.8 },
                        ]}
                      >
                        <Text
                          style={{
                            color: selectedCol
                              ? accent
                              : theme.colors.textPrimary,
                            fontFamily: "Inter_500Medium",
                            fontSize: 14,
                          }}
                        >
                          {col.label}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </Animated.View>
      </>
    );
  }

  return (
    <>
      {currentQuestion.meta?.block ? (
        <ReadingLink
          title={currentQuestion.meta.title}
          block={String(currentQuestion.meta.block)}
          accent={accent}
        />
      ) : null}
      <Animated.View
        style={{ gap: theme.gap(1) }}
        key={currentQuestion.id}
        entering={FadeIn.duration(500)}
      >
        {currentQuestion.options.map((opt, index) => {
          const isSelected = Array.isArray(selected)
            ? selected.includes(opt.id)
            : selected === opt.id;

          const onPress = () => {
            if (currentQuestion.type === "multi") {
              onToggleMulti(currentQuestion.id, opt.id);
            } else {
              onSetAnswer(currentQuestion.id, opt.id);
            }
          };

          return (
            <ChoiceRow
              key={`${currentQuestion.id}-${opt.id}`}
              label={opt.label}
              selected={!!isSelected}
              onPress={onPress}
              accent={accent}
            />
          );
        })}
      </Animated.View>
    </>
  );
}
