import { StyleSheet } from "react-native-unistyles";

export const accents = {
  blue: "#09FFFF",
  blueish: "#80A3EE",
  pink: "#FF369F",
  yellow: "#FFAF21",
  lavender: "#9F8BEA",
};

const dim = (hex: string, opacity: number) => {
  // Convert hex to rgba string
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const primaryColor = accents.blue;

const lightTheme = {
  colors: {
    background: "#f5f5f5",
    headerBackground: "#fafafa",
    foreground: "#EDEAE6",
    typography: "#1B140C",
    dimmed: "#737373",
    label: "#737373",
    tint: "#2C6BFF",
    tintDimmed: "rgba(44, 107, 255, 0.18)",
    tintExtraDimmed: "rgba(44, 107, 255, 0.05)",
    activeTint: primaryColor,
    link: "#6391EB",
    // Semantic tokens
    surface: "white",
    surfaceElevated: "#f5f5f5",
    border: "#d4d4d4",
    borderSubtle: "#e5e5e5",
    textPrimary: "#1B140C",
    textSecondary: "#262626",
    textTertiary: "#525252",
    focusRing: "black",
    danger: accents.pink,
    accents: {
      blue: "#2C6BFF",
      blueish: accents.blueish,
      pink: accents.pink,
      yellow: accents.yellow,
      lavender: accents.lavender,
    },
    accentsDimmed: {
      blue: "rgba(44, 107, 255, 0.18)",
      blueish: dim(accents.blueish, 0.18),
      pink: dim(accents.pink, 0.18),
      yellow: dim(accents.yellow, 0.18),
      lavender: dim(accents.lavender, 0.18),
    },
    accentsExtraDimmed: {
      blue: "rgba(44, 107, 255, 0.05)",
      blueish: dim(accents.blueish, 0.05),
      pink: dim(accents.pink, 0.075), // dim it less since it's a brighter color
      yellow: dim(accents.yellow, 0.05),
      lavender: dim(accents.lavender, 0.075),
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      850: "#1a1a1a",
      900: "#171717",
      950: "#0a0a0a",
    },
  },
  gap: (v: number) => v * 8,
  radius: {
    none: 0,
    sm: 2,
    default: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    full: 9999,
  },
} as const;

const darkTheme = {
  colors: {
    background: "#131313",
    headerBackground: "#171717",
    foreground: "#332618",
    typography: "#FFFFFF",
    dimmed: "#A8A198",
    label: "#a3a3a3",
    tint: primaryColor,
    tintDimmed: "rgba(9,255,255,0.1)",
    tintExtraDimmed: "rgba(9,255,255,0.05)",
    activeTint: primaryColor,
    link: primaryColor,
    // Semantic tokens
    surface: "#1A1A1A",
    surfaceElevated: "#262626",
    border: "#262626",
    borderSubtle: "#262626",
    textPrimary: "#FFFFFF",
    textSecondary: "#E5E5E5",
    textTertiary: "#C2C2C2",
    focusRing: primaryColor,
    danger: accents.pink,
    accents: {
      blue: accents.blue,
      blueish: accents.blueish,
      pink: accents.pink,
      yellow: accents.yellow,
      lavender: accents.lavender,
    },
    accentsDimmed: {
      blue: dim(accents.blue, 0.25),
      blueish: dim(accents.blueish, 0.25),
      pink: dim(accents.pink, 0.35),
      yellow: dim(accents.yellow, 0.25),
      lavender: dim(accents.lavender, 0.25),
    },
    accentsExtraDimmed: {
      blue: dim(accents.blue, 0.05),
      blueish: dim(accents.blueish, 0.05),
      pink: dim(accents.pink, 0.075),
      yellow: dim(accents.yellow, 0.05),
      lavender: dim(accents.lavender, 0.075),
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      850: "#1a1a1a",
      900: "#171717",
      950: "#0a0a0a",
    },
  },
  gap: (v: number) => v * 8,
  radius: {
    none: 0,
    sm: 2,
    default: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    full: 9999,
  },
} as const;

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
});
