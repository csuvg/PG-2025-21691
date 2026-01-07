import { LinearGradient } from "expo-linear-gradient";
import { memo, useMemo } from "react";
import { useUnistyles } from "react-native-unistyles";

const BLENDED_TINTS = {
  light: {
    "#09FFFF": "rgb(216, 251, 249)",
    "#9F8BEA": "rgb(238, 233, 246)",
    "#80A3EE": "rgb(233, 237, 246)",
    "#FFAF21": "rgb(252, 239, 216)",
    "#FF369F": "rgb(252, 221, 235)",
  },
  dark: {
    "#09FFFF": "rgb(18, 54, 54)",
    "#9F8BEA": "rgb(40, 37, 51)",
    "#FF369F": "rgb(54, 24, 40)",
    "#FFAF21": "rgb(54, 42, 21)",
    "#80A3EE": "rgb(35, 41, 52)",
  },
} as const;

function GradientBackground({ accent }: { accent: string }) {
  const { theme, rt } = useUnistyles();

  const gradientColors = useMemo(() => {
    const colors = [
      theme.colors.background,
      // @ts-expect-error
      BLENDED_TINTS[rt.colorScheme][accent] || theme.colors.background,
    ] as const;
    return colors;
  }, [theme.colors.background, rt.colorScheme, accent]);

  const gradientStyle = useMemo(
    () => [
      {
        backgroundColor: theme.colors.background,
      },
      {
        pointerEvents: "none" as const,
        position: "absolute" as const,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    ],
    [theme.colors.background]
  );

  return (
    <LinearGradient
      key={accent}
      colors={gradientColors}
      locations={[0, 1]}
      start={{ x: 0, y: 0.4 }}
      end={{ x: 2.5, y: 1.5 }}
      style={gradientStyle}
    />
  );
}

export default memo(GradientBackground);
