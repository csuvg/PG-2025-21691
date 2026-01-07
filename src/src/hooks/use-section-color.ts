import { useMemo } from "react";
import { useUnistyles } from "react-native-unistyles";

// Memoize the section color map to prevent recreation on every render
const createSectionColorMap = (accents: any, tint: string) => ({
  intro: accents.blue,
  metadata: accents.lavender,
  bfi: accents.pink,
  riasec: accents.yellow,
  grit: accents.blueish,
  piaac: accents.lavender,
  feedback: tint,
});

function useSectionColor(section: string) {
  const { theme } = useUnistyles();

  const sectionColorMap = useMemo(
    () => createSectionColorMap(theme.colors.accents, theme.colors.tint),
    [theme.colors.accents, theme.colors.tint]
  );

  return useMemo(() => {
    return (
      sectionColorMap[section as keyof typeof sectionColorMap] ??
      theme.colors.accents.blue
    );
  }, [section, sectionColorMap, theme.colors.accents.blue]);
}

export default useSectionColor;
