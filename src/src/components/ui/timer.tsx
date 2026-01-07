import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface TimerProps {
  timeLimit: number; // in seconds
  onTimeUp?: () => void;
  style?: any;
}

export default function Timer({ timeLimit, onTimeUp, style }: TimerProps) {
  const { theme } = useUnistyles();
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    // Reset timer when timeLimit changes
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp]);

  const formatTime = (seconds: number): string[] => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = remainingSeconds.toString().padStart(2, "0");
    return [minutesStr[0], minutesStr[1], ":", secondsStr[0], secondsStr[1]];
  };

  const isCriticalTime = timeRemaining <= 10;

  const renderGlyph = (glyph: string, index: number) => (
    <Animated.Text
      key={`${index}-${glyph}`}
      entering={FadeInUp.springify(500)
        .damping(10)
        .mass(0.5)
        .withInitialValues({
          opacity: 0,
        })}
      exiting={FadeOutDown.springify(500)
        .damping(100)
        .mass(0.5)
        .withInitialValues({
          opacity: 1,
          transform: [{ translateY: 0 }],
        })}
      style={[styles.glyphText, isCriticalTime && styles.criticalTime]}
    >
      {glyph}
    </Animated.Text>
  );

  return (
    <View style={[styles.container, style]}>
      {formatTime(timeRemaining).map(renderGlyph)}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    minWidth: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  glyphText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 19,
    color: theme.colors.typography,
  },

  criticalTime: {
    color: theme.colors.danger,
  },
}));
