import type { TraitScores } from "@/api/career";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { mapTraitScoresToSummary } from "@/utils/result-interpretation";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ResultsSummaryProps = {
  traitScores: TraitScores;
};

export default function ResultsSummary({ traitScores }: ResultsSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const { resumen_general, detalles } = mapTraitScoresToSummary(traitScores);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Heading level={6} color="secondary" style={styles.title}>
          Resumen de tu perfil
        </Heading>
        <Pressable
          accessibilityRole="button"
          onPress={() => setExpanded(prev => !prev)}
          hitSlop={8}
        >
          <Paragraph size="xs" color="tertiary" style={styles.link}>
            {expanded ? "Ocultar" : "Ver detalles"}
          </Paragraph>
        </Pressable>
      </View>

      <Paragraph
        size="sm"
        color="primary"
        numberOfLines={expanded ? undefined : 2}
      >
        {resumen_general}
      </Paragraph>

      {expanded && (
        <View style={styles.details}>
          <Paragraph size="xs" color="secondary">
            • {detalles.riasec}
          </Paragraph>
          <Paragraph size="xs" color="secondary">
            • {detalles.bfi}
          </Paragraph>
          <Paragraph size="xs" color="secondary">
            • {detalles.grit}
          </Paragraph>
          <Paragraph size="xs" color="secondary">
            • {detalles.paa_piaac}
          </Paragraph>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderSubtle,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: theme.gap(1.5),
    marginBottom: theme.gap(2),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.gap(0.5),
  },
  title: {
    // keep subtle
  },
  link: {
    // styled like a link
    textDecorationLine: "underline",
  },
  details: {
    marginTop: theme.gap(1),
    gap: theme.gap(0.5),
  },
}));
