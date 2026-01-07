import React from "react";
import { TextInput } from "react-native";
import Animated, {
  type DerivedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

export default function SemesterOverlay({
  semester,
  year,
}: {
  semester: DerivedValue<number>;
  year: DerivedValue<number>;
}) {
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const semesterAnimatedProps = useAnimatedProps(() => {
    return { text: `Semestre ${Math.round(semester.value)}` } as any;
  });
  const yearAnimatedProps = useAnimatedProps(() => {
    return { text: `Año ${Math.round(year.value)}` } as any;
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.semesterOverlay]}>
      <AnimatedTextInput
        editable={false}
        style={[styles.semesterNumber]}
        animatedProps={semesterAnimatedProps}
        defaultValue=""
      />
      <AnimatedTextInput
        editable={false}
        style={styles.semesterYear}
        animatedProps={yearAnimatedProps}
        defaultValue=""
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create(theme => ({
  semesterOverlay: {
    alignItems: "flex-start",
    padding: theme.gap(4),
    // position: "absolute",
  },
  semesterNumber: {
    fontSize: 24,
    lineHeight: 24,
    color: theme.colors.textPrimary,
    fontFamily: "Inter_700Bold",
    includeFontPadding: false,
    padding: 0,
    textAlignVertical: "top",
  },
  semesterYear: {
    color: theme.colors.dimmed,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
    padding: 0,
    textAlignVertical: "top",
  },
}));
