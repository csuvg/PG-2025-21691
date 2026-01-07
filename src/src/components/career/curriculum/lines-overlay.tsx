import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { Edge } from "./types";
import { cubicPath } from "./utils";

export default function LinesOverlay({
  edges,
  width,
  translateX,
}: {
  edges: Edge[];
  width: number;
  translateX: { value: number };
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -translateX.value }],
  }));
  const { theme, rt } = useUnistyles();

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.linesOverlay, animatedStyle]}
    >
      <Svg width={width} height="100%">
        {edges.map(({ from, to, key }) => (
          <Path
            key={key}
            d={cubicPath(from, to, 0.5)}
            stroke={
              rt.colorScheme === "light"
                ? theme.colors.neutral[400]
                : theme.colors.neutral[700]
            }
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
            strokeDasharray={4}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create(theme => ({
  linesOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
}));
