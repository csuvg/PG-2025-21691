import { useRef } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface AnimatedProgressBarProps {
  progress: number; // 0 to 1
  accent: string;
  height?: number;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
}

const DEFAULT_SPRING_CONFIG = {
  damping: 25,
  stiffness: 80,
  mass: 1.2,
};

export default function AnimatedProgressBar({
  progress,
  accent,
  height = 8,
  springConfig = DEFAULT_SPRING_CONFIG,
}: AnimatedProgressBarProps) {
  const { theme } = useUnistyles();
  const progressBarTrackRef = useRef<View>(null);
  const trackWidth = useSharedValue(0);

  const progressBarFillAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(progress * trackWidth.value, springConfig),
    };
  }, [progress]);

  const styles = StyleSheet.create((theme, rt) => ({
    progressBarTrack: {
      height,
      borderRadius: theme.radius.full,
      backgroundColor:
        rt.colorScheme === "dark"
          ? theme.colors.neutral[800]
          : theme.colors.borderSubtle,
      overflow: "hidden",
    },
    progressBarFill: {
      height,
    },
  }));

  return (
    <Animated.View
      ref={progressBarTrackRef}
      style={styles.progressBarTrack}
      onLayout={e => {
        trackWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View
        style={[
          styles.progressBarFill,
          { backgroundColor: accent },
          progressBarFillAnimatedStyle,
        ]}
      />
    </Animated.View>
  );
}
