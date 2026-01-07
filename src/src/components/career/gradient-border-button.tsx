import {
  Canvas,
  Group,
  Paint,
  RoundedRect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import { memo, useMemo } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const BUTTON_HEIGHT = 50;
const BORDER_RADIUS = 9999;
const BORDER_WIDTH = 4;
const PADDING = 16;
const OUTER_PADDING = 24;

interface GradientBorderButtonProps {
  title: string;
  onPress: () => void;
  disableEffect?: boolean;
}

export default function GradientBorderButton({
  title,
  onPress,
  disableEffect = false,
}: GradientBorderButtonProps) {
  const { theme, rt } = useUnistyles();
  const { width: screenWidth } = useWindowDimensions();

  const x = OUTER_PADDING + PADDING + BORDER_WIDTH / 2;
  const y = OUTER_PADDING + BORDER_WIDTH / 2;
  const width = screenWidth - BORDER_WIDTH - PADDING * 2;
  const height = BUTTON_HEIGHT - BORDER_WIDTH;

  const cx = x + width / 2;
  const cy = y + height / 2;

  const colors = useMemo(
    () => [
      theme.colors.accents.lavender,
      theme.colors.accents.blue,
      theme.colors.accents.blueish,
      theme.colors.accents.pink,
      theme.colors.accents.lavender,
    ],
    [theme]
  );

  function isLong(text: string) {
    return text.length > 45;
  }

  const rotationProgress = useSharedValue(0);
  const lastFrameTime = useSharedValue(0);
  const startTime = useSharedValue(0);

  const transform = useDerivedValue(() => [
    { rotate: rotationProgress.value * Math.PI * 2 },
  ]);

  useFrameCallback(frameInfo => {
    "worklet";

    if (startTime.value === 0) {
      startTime.value = frameInfo.timestamp;
      lastFrameTime.value = frameInfo.timestamp;
    }

    // We don't need more than 60 fps.
    const timeSinceLastFrame = frameInfo.timestamp - lastFrameTime.value;
    if (timeSinceLastFrame < 16.67) {
      return;
    }

    lastFrameTime.value = frameInfo.timestamp;

    const elapsed = frameInfo.timestamp - startTime.value;
    rotationProgress.value = (elapsed % 3000) / 3000;
  }, !disableEffect);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={[styles.label, isLong(title) && styles.longLabel]}>
          {title}
        </Text>

        {!disableEffect && (
          <Canvas
            style={{
              width: screenWidth + OUTER_PADDING * 2,
              height: BUTTON_HEIGHT + OUTER_PADDING * 2,
              position: "absolute",
            }}
            id={`gradient-border-button-${rt.colorScheme}`}
          >
            <RoundedRect
              x={x}
              y={y}
              width={width}
              height={height}
              r={BORDER_RADIUS}
              color={theme.colors.surface}
            />
            <Group blendMode="srcIn">
              <RoundedRect
                x={x}
                y={y}
                width={width}
                height={height}
                r={BORDER_RADIUS}
              >
                <Paint
                  style="stroke"
                  strokeWidth={BORDER_WIDTH}
                  strokeJoin="round"
                >
                  <SweepGradient
                    transform={transform}
                    origin={vec(cx, cy)}
                    c={vec(cx, cy)}
                    start={0}
                    end={360}
                    colors={colors}
                  />
                </Paint>
              </RoundedRect>
              <RoundedRect
                x={x}
                y={y}
                width={width}
                height={height}
                r={BORDER_RADIUS}
                color={theme.colors.surface}
              >
                <Paint
                  style="stroke"
                  strokeWidth={BORDER_WIDTH}
                  strokeJoin="round"
                >
                  <SweepGradient
                    transform={transform}
                    origin={vec(cx, cy)}
                    c={vec(cx, cy)}
                    start={0}
                    end={360}
                    colors={[theme.colors.background, "transparent"]}
                  />
                </Paint>
              </RoundedRect>
            </Group>
          </Canvas>
        )}
      </View>
    </Pressable>
  );
}

export const MemoGradientBorderButton = memo(GradientBorderButton);

const styles = StyleSheet.create(theme => ({
  container: {
    width: "100%",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: theme.gap(2),
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    zIndex: 1000,
    textAlign: "center",
    color: theme.colors.textPrimary,
  },
  longLabel: {
    fontSize: 12,
  },
}));
