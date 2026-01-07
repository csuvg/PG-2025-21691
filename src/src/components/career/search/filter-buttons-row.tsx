import Button from "@/components/ui/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "@roninoss/icons";
import { ScrollView, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function FilterButtonsRow({
  selectedFacultiesCount,
  selectedEmployabilitiesCount,
  maxDuration,
  hasSort,
  hasAnyFilter,
  onOpenFaculties,
  onOpenEmployabilities,
  onOpenDuration,
  onOpenSort,
  onClearAll,
  contentStyle,
}: {
  selectedFacultiesCount: number;
  selectedEmployabilitiesCount: number;
  maxDuration: string;
  hasSort: boolean;
  hasAnyFilter: boolean;
  onOpenFaculties: () => void;
  onOpenEmployabilities: () => void;
  onOpenDuration: () => void;
  onOpenSort: () => void;
  onClearAll: () => void;
  contentStyle?: ViewStyle;
}) {
  const { theme } = useUnistyles();
  const selectedChipStyle = {
    backgroundColor: theme.colors.tintDimmed,
    borderColor: theme.colors.tint,
  } as const;

  const filterButtons = [
    {
      id: "faculties",
      isActive: selectedFacultiesCount > 0,
      button: (
        <Button
          key="faculties"
          variant="chip"
          textStyle={
            selectedFacultiesCount > 0
              ? { color: theme.colors.tint }
              : { color: theme.colors.typography }
          }
          style={[styles.chip, selectedFacultiesCount > 0 && selectedChipStyle]}
          size="sm"
          title={
            selectedFacultiesCount > 0
              ? `Facultad (${selectedFacultiesCount})`
              : "Facultad"
          }
          icon={
            <Icon
              name="building.2.fill"
              size={14}
              namingScheme="sfSymbol"
              color={
                selectedFacultiesCount > 0
                  ? theme.colors.tint
                  : theme.colors.label
              }
            />
          }
          onPress={onOpenFaculties}
        />
      ),
    },
    {
      id: "employabilities",
      isActive: selectedEmployabilitiesCount > 0,
      button: (
        <Button
          key="employabilities"
          variant="chip"
          textStyle={
            selectedEmployabilitiesCount > 0
              ? { color: theme.colors.accents.yellow }
              : { color: theme.colors.typography }
          }
          style={[
            styles.chip,
            selectedEmployabilitiesCount > 0 && {
              backgroundColor: theme.colors.accentsDimmed.yellow,
              borderColor: theme.colors.accents.yellow,
            },
          ]}
          size="sm"
          title={
            selectedEmployabilitiesCount > 0
              ? `Empleabilidad (${selectedEmployabilitiesCount})`
              : "Empleabilidad"
          }
          icon={
            <Icon
              name="chart.bar.fill"
              size={14}
              namingScheme="sfSymbol"
              color={
                selectedEmployabilitiesCount > 0
                  ? theme.colors.accents.yellow
                  : theme.colors.label
              }
            />
          }
          onPress={onOpenEmployabilities}
        />
      ),
    },
    {
      id: "duration",
      isActive: !!maxDuration,
      button: (
        <Button
          key="duration"
          variant="chip"
          textStyle={
            maxDuration
              ? { color: theme.colors.accents.pink }
              : { color: theme.colors.typography }
          }
          style={[
            styles.chip,
            maxDuration && {
              backgroundColor: theme.colors.accentsDimmed.pink,
              borderColor: theme.colors.accents.pink,
            },
          ]}
          size="sm"
          title={maxDuration ? `Hasta ${maxDuration} años` : "Duración máxima"}
          icon={
            <Icon
              name="clock.fill"
              size={14}
              namingScheme="sfSymbol"
              color={
                maxDuration ? theme.colors.accents.pink : theme.colors.label
              }
            />
          }
          onPress={onOpenDuration}
        />
      ),
    },
    {
      id: "sort",
      isActive: hasSort,
      button: (
        <Button
          key="sort"
          variant="chip"
          textStyle={
            hasSort
              ? { color: theme.colors.accents.blueish }
              : { color: theme.colors.typography }
          }
          style={[
            styles.chip,
            hasSort && {
              backgroundColor: theme.colors.accentsDimmed.blueish,
              borderColor: theme.colors.accents.blueish,
            },
          ]}
          size="sm"
          title={hasSort ? "Ordenado" : "Ordenar"}
          icon={
            <MaterialCommunityIcons
              name="sort-ascending"
              size={14}
              namingScheme="sfSymbol"
              color={
                hasSort ? theme.colors.accents.blueish : theme.colors.label
              }
            />
          }
          onPress={onOpenSort}
        />
      ),
    },
  ];

  // Sort buttons: active ones first, then inactive
  const sortedButtons = [...filterButtons].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return 0;
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, contentStyle]}
    >
      {hasAnyFilter && (
        <Button
          key="clear-all"
          variant="chip"
          style={styles.clearButton}
          size="sm"
          onPress={onClearAll}
        >
          <Icon
            name="xmark"
            size={16}
            namingScheme="sfSymbol"
            color={theme.colors.textSecondary}
          />
        </Button>
      )}
      {sortedButtons.map(({ button }) => button)}
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    paddingBottom: theme.gap(2),
  },
  chip: {
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1),
  },
  clearButton: {
    width: 32,
    height: 32,
    paddingHorizontal: 0,
    paddingVertical: 0,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
  },
}));
