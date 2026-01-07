import type { ExploreCardType } from "@/data/explore.const";
import { UnistylesRuntime } from "react-native-unistyles";

// Re-export for convenience
export type { ExploreCardType };

// Theme-resolved background colors (worklet-safe static maps)
const EXPLORE_BG_COLOR_MAP_LIGHT: Record<ExploreCardType, string> = {
  short_question: "rgba(159,139,234,0.05)",
  // Use a deeper blue tint in light mode for contrast
  career: "rgba(44,107,255,0.06)",
  testimony: "rgba(255,54,159,0.05)",
  what_if: "rgba(255,175,33,0.05)",
};

const EXPLORE_BG_COLOR_MAP_DARK: Record<ExploreCardType, string> = {
  short_question: "rgba(159,139,234,0.05)",
  career: "rgba(9,255,255,0.05)",
  testimony: "rgba(255,54,159,0.05)",
  what_if: "rgba(255,175,33,0.05)",
};

export const EXPLORE_BG_COLOR_MAP: Record<ExploreCardType, string> =
  UnistylesRuntime.colorScheme === "light"
    ? EXPLORE_BG_COLOR_MAP_LIGHT
    : EXPLORE_BG_COLOR_MAP_DARK;

// Theme-resolved accent colors (also available as a static map)
const EXPLORE_ACCENT_COLOR_MAP_LIGHT: Record<ExploreCardType, string> = {
  short_question: "rgb(159,139,234)",
  career: "#2C6BFF",
  testimony: "rgb(255,54,159)",
  what_if: "rgb(255,175,33)",
};

const EXPLORE_ACCENT_COLOR_MAP_DARK: Record<ExploreCardType, string> = {
  short_question: "rgb(159,139,234)",
  career: "rgb(9,255,255)",
  testimony: "rgb(255,54,159)",
  what_if: "rgb(255,175,33)",
};

export const EXPLORE_ACCENT_COLOR_MAP: Record<ExploreCardType, string> =
  UnistylesRuntime.colorScheme === "light"
    ? EXPLORE_ACCENT_COLOR_MAP_LIGHT
    : EXPLORE_ACCENT_COLOR_MAP_DARK;

export function getAccentColor(type: ExploreCardType) {
  return EXPLORE_ACCENT_COLOR_MAP[type] ?? DEFAULT_ACCENT_COLOR;
}

export const EXPLORE_ICON_MAP: Record<ExploreCardType, string> = {
  short_question: "lightbulb",
  career: "magnifyingglass",
  testimony: "person.circle",
  what_if: "sparkle",
};

export const DEFAULT_BG_COLOR = "rgba(128,163,238,0.05)";
export const DEFAULT_ACCENT_COLOR = "rgb(128,163,238)";
export const DEFAULT_ICON = "star";
