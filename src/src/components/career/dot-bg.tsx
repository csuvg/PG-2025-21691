import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function DottedBackground({
  dotSize = 1,
  spacing = 20,
}: {
  dotSize?: number;
  spacing?: number;
}) {
  // pattern tile size equals spacing
  const tile = spacing;
  const { theme } = useUnistyles();
  return (
    <Svg
      width="100%"
      height="100%"
      style={stylez.absolute}
      pointerEvents="none"
      preserveAspectRatio="xMinYMin slice"
    >
      <Defs>
        <Pattern
          id="dotPattern"
          x="0"
          y="0"
          width={tile}
          height={tile}
          patternUnits="userSpaceOnUse"
        >
          {/* place the dot near the top-left of the tile */}
          <Circle
            cx={dotSize + 2}
            cy={dotSize + 2}
            r={dotSize}
            fill={theme.colors.borderSubtle}
          />
        </Pattern>
      </Defs>

      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)" />
    </Svg>
  );
}

const stylez = StyleSheet.create(theme => ({
  absolute: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
}));
