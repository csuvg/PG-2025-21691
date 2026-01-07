import { ExploreCardType } from "@/data/explore.const";
import { DEFAULT_BG_COLOR, EXPLORE_BG_COLOR_MAP } from "@/data/explore.maps";
import {
  Canvas,
  interpolateColors,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ExploreBackgroundProps = {
  progress: SharedValue<number>;
  snap: number;
  typesSV: SharedValue<ExploreCardType[]>;
  loading: boolean;
};

export default function ExploreBackground({
  progress,
  snap,
  typesSV,
  loading,
}: ExploreBackgroundProps) {
  const { width: screenWidth, height } = useWindowDimensions();
  const { theme } = useUnistyles();

  const bgColor = useSharedValue<string>(theme.colors.background);

  useEffect(() => {
    bgColor.value = theme.colors.background;
  }, [theme.colors.background, bgColor]);

  const gradient = useDerivedValue(() => {
    "worklet";
    const page = (progress.value + 0.0001) / snap;
    let i = Math.floor(page);
    let t = Math.min(1, Math.max(0, page - i));

    const types = typesSV.value;
    if (types.length <= 1) {
      return [DEFAULT_BG_COLOR, bgColor.value];
    }

    if (i < 0) {
      i = 0;
      t = 0;
    }
    if (i >= types.length - 1) {
      i = types.length - 2;
      t = 1;
    }

    // Get the background color of the current and next card.
    const c0 = EXPLORE_BG_COLOR_MAP[types[i]] ?? DEFAULT_BG_COLOR;
    const c1 = EXPLORE_BG_COLOR_MAP[types[i + 1]] ?? DEFAULT_BG_COLOR;

    if (c0 === c1) {
      // They're the same, no need to interpolate!
      return [c0, bgColor.value];
    }

    const mixed = interpolateColors(t, [0, 1], [c0, c1]);
    return [mixed, bgColor.value];
  });

  const center = vec(screenWidth * 0.5, height);
  const radius = Math.max(screenWidth, height) * 1;

  const topCenter = vec(screenWidth * 0.5, 0);
  const topRadius = screenWidth * 0.8;

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Canvas style={[styles.canvas, { width: screenWidth, height }]}>
        <Rect x={0} y={0} width={screenWidth} height={height}>
          <RadialGradient
            c={center}
            r={radius}
            colors={gradient}
            positions={[0, 1]}
          />
        </Rect>
        <Rect x={0} y={0} width={screenWidth} height={height}>
          <RadialGradient
            c={topCenter}
            r={topRadius}
            colors={["rgba(255, 255, 255, 0.15)", "transparent"]}
            positions={[0, 0.9]}
          />
        </Rect>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  canvas: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}));
