import Heading from "@/components/ui/heading";
import { Platform } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const AnimatedHeading = Animated.createAnimatedComponent(Heading);

interface AnimatedCareerHeaderProps {
  title: string;
  scrollOffset: SharedValue<number>;
  statusBarHeight: number;
  backgroundColor: string;
}

const COVER_IMAGE_HEIGHT = 350;
const HEADER_HEIGHT = 44;
const CONTENT_PADDING_TOP = 16;
const HEADING_HEIGHT = 80;

export default function AnimatedCareerHeader({
  title,
  scrollOffset,
  statusBarHeight,
  backgroundColor,
}: AnimatedCareerHeaderProps) {
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    const headingBottomPosition =
      COVER_IMAGE_HEIGHT + CONTENT_PADDING_TOP + HEADING_HEIGHT;
    const navigationHeaderHeight = statusBarHeight + HEADER_HEIGHT;
    const transitionEnd = headingBottomPosition - navigationHeaderHeight;

    const opacity = interpolate(
      scrollOffset.value,
      [transitionEnd - 20, transitionEnd],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <AnimatedHeading
      level={5}
      style={[styles.headerTitle, headerTitleAnimatedStyle]}
    >
      {title}
    </AnimatedHeading>
  );
}

export function AnimatedHeaderBackground({
  scrollOffset,
  statusBarHeight,
  backgroundColor,
}: Omit<AnimatedCareerHeaderProps, "title">) {
  const headerBackgroundAnimatedStyle = useAnimatedStyle(() => {
    const headingBottomPosition =
      COVER_IMAGE_HEIGHT + CONTENT_PADDING_TOP + HEADING_HEIGHT;
    const navigationHeaderHeight = statusBarHeight + HEADER_HEIGHT;
    const transitionEnd = headingBottomPosition - navigationHeaderHeight;

    const opacity = interpolate(
      scrollOffset.value,
      [transitionEnd - 20, transitionEnd],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  if (Platform.OS !== "android") {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor,
        },
        headerBackgroundAnimatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create(theme => ({
  headerTitle: {
    color: theme.colors.textPrimary,
  },
}));
