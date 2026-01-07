import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  type ColorValue,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const AnimatedView = Animated.createAnimatedComponent(View);

type SkeletonProps = {
  duration?: number;
  backgroundSize?: number; // how wide the shine band is (multiplier of width)
  colors?: string[];
  show?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Skeleton({
  duration = 600,
  backgroundSize = 2.5, // wider band for smooth shimmer
  colors = ["transparent", "rgba(255,255,255,0.3)", "transparent"],
  show = true,
  style,
}: SkeletonProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const translateX = useSharedValue(0);
  const startOffset = useSharedValue(500);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (measuredWidth !== width) {
      setMeasuredWidth(width);
      translateX.value = 0 + startOffset.value;
    }
  };

  useEffect(() => {
    if (measuredWidth === 0 || !show) return;

    const travelDistance =
      -measuredWidth * (backgroundSize - 1) - startOffset.value;

    translateX.value = withRepeat(
      withTiming(travelDistance, { duration }),
      -1,
      false
    );
  }, [duration, backgroundSize, measuredWidth, show]);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {measuredWidth > 0 && show && (
        <MemoizedGradient
          measuredWidth={measuredWidth}
          backgroundSize={backgroundSize}
          colors={colors}
          translateX={translateX}
        />
      )}
    </View>
  );
}

const MemoizedGradient = React.memo(
  function GradientLayer({
    measuredWidth,
    backgroundSize,
    colors,
    translateX,
  }: {
    measuredWidth: number;
    backgroundSize: number;
    colors: string[];
    translateX: SharedValue<number>;
  }) {
    const animatedStyle = useAnimatedStyle(() => ({
      width: measuredWidth * backgroundSize,
      transform: [{ translateX: translateX.value }],
    }));

    return (
      <AnimatedView
        style={[StyleSheet.absoluteFillObject, animatedStyle]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={colors as [ColorValue, ColorValue, ...ColorValue[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </AnimatedView>
    );
  },
  (prev, next) =>
    prev.measuredWidth === next.measuredWidth &&
    prev.backgroundSize === next.backgroundSize &&
    prev.colors.join() === next.colors.join()
);

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    backgroundColor:
      rt.colorScheme === "dark"
        ? theme.colors.neutral[800]
        : theme.colors.neutral[300], // fallback skeleton base
    borderRadius: 8,
    overflow: "hidden",
  },
}));
