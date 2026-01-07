import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function SectionIntro({
  title,
  subtitle,
  onContinue,
  accent,
}: {
  title: string;
  subtitle: string;
  onContinue: () => void;
  accent: string;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <Animated.View
        style={{ gap: theme.gap(1), flex: 1, justifyContent: "center" }}
        entering={FadeInRight.springify(700).withInitialValues({
          transform: [{ translateX: 100 }],
          opacity: 0,
        })}
      >
        <Heading level={1}>{title}</Heading>
        <Paragraph size="base" style={{ color: theme.colors.textSecondary }}>
          {subtitle}
        </Paragraph>
      </Animated.View>

      <Button title="Continuar" onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(3),
    justifyContent: "space-between",
  },
}));
