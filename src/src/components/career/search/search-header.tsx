import { Icon } from "@roninoss/icons";
import { router } from "expo-router";
import { Pressable, TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function SearchHeader({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (text: string) => void;
  inputRef: React.RefObject<TextInput | null>;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.customHeader}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerIconButton}
          accessibilityRole="button"
        >
          <Icon
            name="chevron.left"
            size={28}
            namingScheme="sfSymbol"
            color={theme.colors.tint}
          />
        </Pressable>
        <View style={[styles.searchBar, { flex: 1 }]}>
          <Icon
            name="magnifyingglass"
            size={16}
            namingScheme="sfSymbol"
            color={theme.colors.textTertiary}
          />
          <TextInput
            ref={inputRef}
            autoFocus
            value={value}
            onChangeText={onChange}
            placeholder="Buscar carreras o habilidades..."
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {!!value && (
            <Pressable
              onPress={() => onChange("")}
              style={styles.headerIconButton}
              accessibilityRole="button"
            >
              <Icon
                name="xmark"
                size={16}
                namingScheme="sfSymbol"
                color={theme.colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  customHeader: {
    marginTop: rt.insets.top,
    paddingHorizontal: theme.gap(1),
    paddingRight: theme.gap(2),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconButton: {
    padding: theme.gap(0.25),
    borderRadius: theme.radius.full,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1),
    borderRadius: theme.radius.xl,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    fontFamily: "InstrumentSans_400Regular",
    color: theme.colors.textPrimary,
  },
}));
