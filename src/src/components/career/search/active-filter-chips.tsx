import Tag from "@/components/ui/tag";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function ActiveFilterChips({
  faculties,
  employabilities,
  maxDuration,
  sortLabel,
  onRemoveFaculty,
  onRemoveEmployability,
}: {
  faculties: string[];
  employabilities: string[];
  maxDuration?: string;
  sortLabel?: string | null;
  onRemoveFaculty: (f: string) => void;
  onRemoveEmployability: (e: string) => void;
}) {
  return (
    <View style={styles.activeChips}>
      {faculties.map(f => (
        <TouchableOpacity key={`fac-${f}`} onPress={() => onRemoveFaculty(f)}>
          <Tag size="sm" variant="none" capitalize>{`${f}  ×`}</Tag>
        </TouchableOpacity>
      ))}
      {employabilities.map(e => (
        <TouchableOpacity
          key={`emp-${e}`}
          onPress={() => onRemoveEmployability(e)}
        >
          <Tag size="sm" variant="none" capitalize>{`${e}  ×`}</Tag>
        </TouchableOpacity>
      ))}
      {maxDuration ? (
        <Tag size="sm" variant="none">{`Hasta ${maxDuration} años`}</Tag>
      ) : null}
      {sortLabel ? (
        <Tag size="sm" variant="outline">
          {sortLabel}
        </Tag>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  activeChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.gap(1),
    paddingHorizontal: theme.gap(2),
    paddingBottom: theme.gap(1),
  },
}));
