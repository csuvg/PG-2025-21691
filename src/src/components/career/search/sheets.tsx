import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Feather } from "@expo/vector-icons";
import type { TrueSheet as TrueSheetType } from "@lodev09/react-native-true-sheet";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { forwardRef } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

// Small, focused sheets used by the filter chips row

function CheckRow({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.optionRow}
    >
      <View
        style={[
          styles.checkboxBox,
          checked && {
            backgroundColor: theme.colors.tint,
            borderColor: theme.colors.tint,
          },
        ]}
      >
        {checked ? <Feather name="check" size={14} color="black" /> : null}
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function RadioRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();
  return (
    <Pressable
      onPressIn={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={styles.optionRow}
    >
      <View style={styles.radioOuter}>
        {selected ? (
          <View
            style={[styles.radioInner, { backgroundColor: theme.colors.tint }]}
          />
        ) : null}
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
    </Pressable>
  );
}

export interface FacultiesSheetProps {
  faculties: string[];
  selectedFaculties: string[];
  setSelectedFaculties: (fn: (prev: string[]) => string[]) => void;
}

export const FacultiesSheet = forwardRef<TrueSheetType, FacultiesSheetProps>(
  ({ faculties, selectedFaculties, setSelectedFaculties }, ref) => {
    const { theme } = useUnistyles();
    return (
      <TrueSheet
        ref={ref}
        sizes={["auto"]}
        cornerRadius={16}
        backgroundColor={theme.colors.background}
        dimmed
        style={styles.sheet}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Facultad</Text>
          <View style={{ gap: theme.gap(1.5) }}>
            {faculties.map(f => (
              <CheckRow
                key={f}
                label={f}
                checked={selectedFaculties.includes(f)}
                onPress={() =>
                  setSelectedFaculties(prev =>
                    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
                  )
                }
              />
            ))}
          </View>
        </View>
      </TrueSheet>
    );
  }
);

export interface EmployabilitiesSheetProps {
  employabilities: string[];
  selectedEmployabilities: string[];
  setSelectedEmployabilities: (fn: (prev: string[]) => string[]) => void;
}

export const EmployabilitiesSheet = forwardRef<
  TrueSheetType,
  EmployabilitiesSheetProps
>(
  (
    { employabilities, selectedEmployabilities, setSelectedEmployabilities },
    ref
  ) => {
    const { theme } = useUnistyles();
    return (
      <TrueSheet
        ref={ref}
        sizes={["auto"]}
        cornerRadius={16}
        backgroundColor={theme.colors.background}
        dimmed
        style={styles.sheet}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Empleabilidad</Text>
          <View style={{ gap: theme.gap(1.5) }}>
            {employabilities.map(e => (
              <CheckRow
                key={e}
                label={e.charAt(0).toUpperCase() + e.slice(1)}
                checked={selectedEmployabilities.includes(e)}
                onPress={() =>
                  setSelectedEmployabilities(prev =>
                    prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
                  )
                }
              />
            ))}
          </View>
        </View>
      </TrueSheet>
    );
  }
);

export interface DurationSheetProps {
  maxDuration: string;
  setMaxDuration: (v: string) => void;
  onApply?: () => void;
}

export const DurationSheet = forwardRef<TrueSheetType, DurationSheetProps>(
  ({ maxDuration, setMaxDuration, onApply }, ref) => {
    const { theme } = useUnistyles();
    return (
      <TrueSheet
        ref={ref}
        sizes={["auto"]}
        cornerRadius={16}
        backgroundColor={theme.colors.background}
        dimmed
        style={styles.sheet}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Duración máxima</Text>
          <Input
            placeholder="Hasta X años"
            keyboardType="number-pad"
            value={maxDuration}
            onChangeText={setMaxDuration}
            inputStyle={{ fontSize: 14 }}
          />
          <View style={styles.actions}>
            <Button variant="primary" title="Aplicar" onPress={onApply} />
          </View>
        </View>
      </TrueSheet>
    );
  }
);

type SortKey =
  | "none"
  | "nameAsc"
  | "durationAsc"
  | "durationDesc"
  | "employabilityDesc";

export interface SortSheetProps {
  sortOption: SortKey;
  setSortOption: (v: SortKey) => void;
}

export const SortSheet = forwardRef<TrueSheetType, SortSheetProps>(
  ({ sortOption, setSortOption }, ref) => {
    const { theme } = useUnistyles();
    const options: Array<{ key: SortKey; label: string }> = [
      { key: "none", label: "Relevancia" },
      { key: "nameAsc", label: "Nombre (A–Z)" },
      { key: "durationAsc", label: "Duración (menor a mayor)" },
      { key: "durationDesc", label: "Duración (mayor a menor)" },
      { key: "employabilityDesc", label: "Empleabilidad (alta a baja)" },
    ];

    return (
      <TrueSheet
        ref={ref}
        sizes={["auto"]}
        cornerRadius={16}
        backgroundColor={theme.colors.background}
        dimmed
        style={styles.sheet}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Ordenar por</Text>
          <View style={{ gap: theme.gap(1.5) }}>
            {options.map(opt => (
              <RadioRow
                key={opt.key}
                label={opt.label}
                selected={sortOption === opt.key}
                onPress={() => setSortOption(opt.key)}
              />
            ))}
          </View>
        </View>
      </TrueSheet>
    );
  }
);

const styles = StyleSheet.create(theme => ({
  sheet: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderBottomWidth: 0,
    flex: 1,
  },
  content: {
    padding: theme.gap(2),
    gap: theme.gap(1.5),
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 18,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.gap(0.5),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(2),
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1.25),
    // borderWidth: 1,
    // borderColor: theme.colors.borderSubtle,
    // borderRadius: theme.radius.lg,
    // backgroundColor: theme.colors.surfaceElevated,
  },
  optionLabel: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  durationDash: {
    color: theme.colors.textSecondary,
  },
  actions: {
    marginTop: theme.gap(1),
  },
}));
