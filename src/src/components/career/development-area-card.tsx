import { type DevelopmentArea } from "@/api/career";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type DevelopmentAreaCardProps = {
  area: DevelopmentArea;
  index: number;
};

export default function DevelopmentAreaCard({
  area,
  index,
}: DevelopmentAreaCardProps) {
  const { theme } = useUnistyles();

  // Rotar entre colores de acento para variedad visual
  const accentKeys = ["blue", "pink", "yellow", "lavender", "blueish"] as const;
  const accentKey = accentKeys[index % accentKeys.length];
  const accentColor = theme.colors.accents[accentKey];
  const accentDimmed = theme.colors.accentsDimmed[accentKey];
  const accentExtraDimmed = theme.colors.accentsExtraDimmed[accentKey];

  return (
    <View
      style={[
        styles.areaCard,
        {
          backgroundColor: accentExtraDimmed,
          borderColor: accentDimmed,
        },
      ]}
    >
      <Heading
        level={1}
        style={[styles.backgroundNumber, { color: accentColor }]}
      >
        {index + 1}
      </Heading>
      <View style={styles.areaHeader}>
        <Heading level={5} style={[styles.areaTitle, { color: accentColor }]}>
          {area.area}
        </Heading>
      </View>
      {area.descripcion && (
        <Paragraph size="sm" color="secondary" style={styles.description}>
          {area.descripcion}
        </Paragraph>
      )}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  areaCard: {
    padding: theme.gap(1.5),
    borderRadius: theme.radius.lg,
    borderWidth: 1.25,
    borderStyle: "dashed",
    gap: theme.gap(1.5),
    flexShrink: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundNumber: {
    position: "absolute",
    bottom: theme.gap(-2),
    right: theme.gap(0.75),
    fontSize: 120,
    fontFamily: "Inter_700Bold",
    opacity: 0.15,
    lineHeight: 120,
    zIndex: 0,
  },
  areaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1.25),
    zIndex: 1,
  },
  areaTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
  },
  description: {
    flexShrink: 1,
    width: "100%",
    zIndex: 1,
  },
}));
