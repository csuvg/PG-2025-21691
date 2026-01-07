import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { Icon } from "@roninoss/icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function CareerHeader({
  title,
  description,
  duration,
  employability,
  faculty,
}: {
  title: string;
  description: string;
  duration: string;
  employability: string;
  faculty: string;
}) {
  const [showMore, setShowMore] = useState(false);
  const { theme } = useUnistyles();
  return (
    <View style={styles.header}>
      <View
        style={[
          styles.row,
          {
            justifyContent: "flex-start",
            rowGap: theme.gap(0.5),
            columnGap: theme.gap(2),
          },
        ]}
      >
        <View
          style={[styles.row, { alignItems: "center", gap: theme.gap(0.75) }]}
        >
          <Icon
            name="building.2.fill"
            namingScheme="sfSymbol"
            size={16}
            color={theme.colors.label}
          />
          <Paragraph size="xs" style={{ color: theme.colors.textSecondary }}>
            {faculty}
          </Paragraph>
        </View>
        <View
          style={[
            styles.row,
            {
              alignItems: "center",
              gap: theme.gap(0.5),
            },
          ]}
        >
          <Icon
            name="clock.fill"
            namingScheme="sfSymbol"
            size={16}
            color={theme.colors.label}
          />
          <Paragraph size="xs" style={{ color: theme.colors.textSecondary }}>
            {duration}
          </Paragraph>
        </View>
        <View
          style={[styles.row, { alignItems: "center", gap: theme.gap(0.75) }]}
        >
          <Icon
            name="chart.bar.fill"
            namingScheme="sfSymbol"
            size={16}
            color={theme.colors.label}
          />
          <Paragraph
            style={{
              textTransform: "capitalize",
              color: theme.colors.textSecondary,
            }}
            size="xs"
          >
            {employability} Demanda
          </Paragraph>
        </View>
      </View>
      <Heading level={2}>{title}</Heading>
      <Paragraph size="sm" numberOfLines={showMore ? undefined : 4}>
        {description}
      </Paragraph>
      <Pressable onPress={() => setShowMore(!showMore)}>
        <Paragraph size="sm" style={styles.readMoreText}>
          {showMore ? "Leer menos" : "Leer más"}
        </Paragraph>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  header: {
    gap: theme.gap(1),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: theme.gap(1),
    // backgroundColor: theme.colors.surfaceElevated,
  },
  readMoreText: {
    color: theme.colors.tint,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
}));
