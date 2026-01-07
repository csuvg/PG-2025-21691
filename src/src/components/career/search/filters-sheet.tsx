import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function FiltersSheet({
  sheetRef,
  faculties,
  employabilities,
  selectedFaculties,
  setSelectedFaculties,
  selectedEmployabilities,
  setSelectedEmployabilities,
  maxDuration,
  setMaxDuration,
  sortOption,
  setSortOption,
  onClose,
}: any) {
  const { theme } = useUnistyles();
  return (
    <TrueSheet
      ref={sheetRef}
      sizes={["medium", "large"]}
      cornerRadius={16}
      backgroundColor={theme.colors.surface}
      dimmed={true}
      style={styles.sheet}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.sheetTitle}>Filtros</Text>

        <Text style={styles.sectionTitle}>Facultad</Text>
        <View style={{ gap: theme.gap(1) }}>
          {faculties.map((f: string) => (
            <Checkbox
              key={f}
              value={selectedFaculties.includes(f)}
              onValueChange={(checked: boolean) => {
                setSelectedFaculties((prev: string[]) =>
                  checked ? [...prev, f] : prev.filter(x => x !== f)
                );
              }}
              label={f}
            />
          ))}
        </View>

        <View style={{ height: theme.gap(2) }} />
        <Text style={styles.sectionTitle}>Empleabilidad</Text>
        <View style={{ gap: theme.gap(1) }}>
          {employabilities.map((e: string) => (
            <Checkbox
              key={e}
              value={selectedEmployabilities.includes(e)}
              onValueChange={(checked: boolean) => {
                setSelectedEmployabilities((prev: string[]) =>
                  checked ? [...prev, e] : prev.filter(x => x !== e)
                );
              }}
              label={e}
            />
          ))}
        </View>

        <View style={{ height: theme.gap(2) }} />
        <Text style={styles.sectionTitle}>Duración máxima</Text>
        <Input
          placeholder="Hasta X años"
          keyboardType="number-pad"
          value={maxDuration}
          onChangeText={setMaxDuration}
          inputStyle={{ fontSize: 14 }}
        />

        <View style={{ height: theme.gap(2) }} />
        <Text style={styles.sectionTitle}>Ordenar por</Text>
        <View style={{ gap: theme.gap(1) }}>
          {[
            { key: "none", label: "Relevancia" },
            { key: "nameAsc", label: "Nombre (A–Z)" },
            { key: "durationAsc", label: "Duración (menor a mayor)" },
            { key: "durationDesc", label: "Duración (mayor a menor)" },
            { key: "employabilityDesc", label: "Empleabilidad (alta a baja)" },
          ].map(opt => (
            <Checkbox
              key={opt.key}
              value={sortOption === (opt.key as any)}
              onValueChange={() => setSortOption(opt.key as any)}
              label={opt.label}
            />
          ))}
        </View>

        <View style={styles.sheetButtons}>
          <Button
            variant="secondary"
            title="Cancelar"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            variant="primary"
            title="Aplicar"
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </TrueSheet>
  );
}

const styles = StyleSheet.create(theme => ({
  sheet: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderBottomWidth: 0,
    flex: 1,
  },
  sheetContent: {
    padding: theme.gap(2),
    gap: theme.gap(1.5),
    backgroundColor: theme.colors.surface,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.gap(0.5),
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: theme.colors.label,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  durationDash: {
    color: theme.colors.textSecondary,
  },
  sheetButtons: {
    flexDirection: "row",
    gap: theme.gap(1),
    marginTop: theme.gap(1),
  },
}));
