import { useCareers, type Career } from "@/api/career";
import CareerListItem from "@/components/career/search/career-list-item";
import FilterButtonsRow from "@/components/career/search/filter-buttons-row";
import SearchHeader from "@/components/career/search/search-header";
import {
  DurationSheet,
  EmployabilitiesSheet,
  FacultiesSheet,
  SortSheet,
} from "@/components/career/search/sheets";
import { useAnalytics } from "@/hooks/use-analytics";
import type { TrueSheet as TrueSheetType } from "@lodev09/react-native-true-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Stack } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TextInput } from "react-native";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function CareersSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useUnistyles();
  const { careerSearchQuery } = useAnalytics();

  const bottomTabBarHeight = useBottomTabBarHeight();

  const { data: careers = [], isLoading, error } = useCareers();

  // Filters state
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [selectedEmployabilities, setSelectedEmployabilities] = useState<
    string[]
  >([]);
  const [maxDuration, setMaxDuration] = useState<string>("");
  const [sortOption, setSortOption] = useState<
    "none" | "nameAsc" | "durationAsc" | "durationDesc" | "employabilityDesc"
  >("none");

  // Individual sheets
  const facultiesSheetRef = useRef<TrueSheetType>(null);
  const employabilitiesSheetRef = useRef<TrueSheetType>(null);
  const durationSheetRef = useRef<TrueSheetType>(null);
  const sortSheetRef = useRef<TrueSheetType>(null);
  const headerInputRef = useRef<TextInput>(null as any);

  async function openFaculties() {
    try {
      await facultiesSheetRef.current?.present();
    } catch {}
  }
  async function openEmployabilities() {
    try {
      await employabilitiesSheetRef.current?.present();
    } catch {}
  }
  async function openDuration() {
    try {
      await durationSheetRef.current?.present();
    } catch {}
  }
  async function openSort() {
    try {
      await sortSheetRef.current?.present();
    } catch {}
  }

  function clearAllFilters() {
    setSelectedFaculties([]);
    setSelectedEmployabilities([]);
    setMaxDuration("");
    setSortOption("none");
  }

  const hasAnyFilter =
    selectedFaculties.length > 0 ||
    selectedEmployabilities.length > 0 ||
    !!maxDuration ||
    sortOption !== "none";

  // Derived filter options
  const faculties = useMemo(
    () => Array.from(new Set(careers.map(c => c.faculty))).sort(),
    [careers]
  );
  const employabilities = useMemo(
    () => Array.from(new Set(careers.map(c => c.employability))).sort(),
    [careers]
  );

  const employabilityRank: Record<string, number> = useMemo(
    () => ({
      "muy alta": 4,
      alta: 3,
      media: 2,
      baja: 1,
    }),
    []
  );

  const filteredByQuery = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return careers;
    return careers.filter(
      career =>
        career.name.toLowerCase().includes(q) ||
        career.description.toLowerCase().includes(q) ||
        career.faculty.toLowerCase().includes(q)
    );
  }, [careers, searchQuery]);

  const filteredByFacets = useMemo(() => {
    const maxD =
      Number.isNaN(Number(maxDuration)) || maxDuration === ""
        ? undefined
        : Number(maxDuration);

    return filteredByQuery.filter(c => {
      if (
        selectedFaculties.length > 0 &&
        !selectedFaculties.includes(c.faculty)
      ) {
        return false;
      }
      if (
        selectedEmployabilities.length > 0 &&
        !selectedEmployabilities
          .map(e => e.toLowerCase())
          .includes(c.employability.toLowerCase())
      ) {
        return false;
      }
      if (maxD !== undefined && c.duration > maxD) return false;
      return true;
    });
  }, [
    filteredByQuery,
    selectedFaculties,
    selectedEmployabilities,
    maxDuration,
  ]);

  const careersToShow = useMemo(() => {
    const arr = [...filteredByFacets];
    switch (sortOption) {
      case "nameAsc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "durationAsc":
        arr.sort((a, b) => a.duration - b.duration);
        break;
      case "durationDesc":
        arr.sort((a, b) => b.duration - a.duration);
        break;
      case "employabilityDesc":
        arr.sort(
          (a, b) =>
            (employabilityRank[b.employability?.toLowerCase()] ?? 0) -
            (employabilityRank[a.employability?.toLowerCase()] ?? 0)
        );
        break;
      default:
        break;
    }
    return arr;
  }, [filteredByFacets, sortOption, employabilityRank]);

  // Debounced search query analytics
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentQueryRef = useRef<string>("");
  useEffect(() => {
    const q = searchQuery.trim();
    if (q === lastSentQueryRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      lastSentQueryRef.current = q;
      if (q.length === 0) return;
      const top = careersToShow[0];
      careerSearchQuery({
        query: q,
        resultsCount: careersToShow.length,
        topCareerId: top?._id,
        topCareerName: top?.name,
      });
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, careersToShow, careerSearchQuery]);

  function renderCareerItem({ item, index }: { item: Career; index: number }) {
    return (
      <CareerListItem
        item={item}
        isFirst={index === 0}
        isLast={index === careersToShow.length - 1}
      />
    );
  }

  function renderSeparator() {
    return <View style={styles.separator} />;
  }

  function renderListHeader() {
    return (
      <View>
        {/* Filter buttons row */}
        <FilterButtonsRow
          selectedFacultiesCount={selectedFaculties.length}
          selectedEmployabilitiesCount={selectedEmployabilities.length}
          maxDuration={maxDuration}
          hasSort={sortOption !== "none"}
          hasAnyFilter={hasAnyFilter}
          onOpenFaculties={openFaculties}
          onOpenEmployabilities={openEmployabilities}
          onOpenDuration={openDuration}
          onOpenSort={openSort}
          onClearAll={clearAllFilters}
          contentStyle={styles.filterButtonsRow}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          header: () => (
            <SearchHeader
              value={searchQuery}
              onChange={setSearchQuery}
              inputRef={headerInputRef}
            />
          ),
        }}
      />
      <FlatList
        data={isLoading ? [] : careersToShow}
        renderItem={renderCareerItem}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ bottom: bottomTabBarHeight }}
        style={styles.list}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.tint} />
          ) : (
            <View style={styles.container}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  No se encontraron carreras
                </Text>
                <Text style={styles.emptyStateDescription}>
                  Intenta buscar con otros términos o palabras clave
                </Text>
              </View>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Individual filter sheets */}
      <FacultiesSheet
        ref={facultiesSheetRef}
        faculties={faculties}
        selectedFaculties={selectedFaculties}
        setSelectedFaculties={setSelectedFaculties}
      />
      <EmployabilitiesSheet
        ref={employabilitiesSheetRef}
        employabilities={employabilities}
        selectedEmployabilities={selectedEmployabilities}
        setSelectedEmployabilities={setSelectedEmployabilities}
      />
      <DurationSheet
        ref={durationSheetRef}
        maxDuration={maxDuration}
        setMaxDuration={setMaxDuration}
        onApply={async () => {
          try {
            await durationSheetRef.current?.dismiss();
          } catch {}
        }}
      />
      <SortSheet
        ref={sortSheetRef}
        sortOption={sortOption as any}
        setSortOption={setSortOption as any}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  customHeader: {
    marginTop: rt.insets.top,
    paddingRight: theme.gap(2),
    paddingBottom: theme.gap(1),
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.gap(2),
  },
  filterButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    paddingBottom: theme.gap(2),
  },
  filtersBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(1),
  },
  filtersButton: {
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1),
  },
  clearAllText: {
    color: theme.colors.tint,
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  activeChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.gap(1),
    paddingHorizontal: theme.gap(2),
    paddingBottom: theme.gap(1),
  },
  careerItem: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(2),
    borderColor: theme.colors.borderSubtle,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0,
    marginHorizontal: 0,
  },
  careerItemFirst: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  careerItemLast: {
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderBottomWidth: 0.5,
  },
  careerItemPressed: {
    backgroundColor: theme.colors.surfaceElevated,
    opacity: 0.8,
  },
  careerContent: {
    flex: 1,
  },
  careerTitle: {
    fontSize: 15,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
    marginBottom: theme.gap(0.25),
  },
  careerFaculty: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: theme.colors.dimmed,
    marginBottom: theme.gap(0.5),
  },
  careerDescription: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.gap(0.75),
  },
  careerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  careerDuration: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: theme.colors.dimmed,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  careerEmployability: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: theme.colors.tint,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  careerSkills: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: theme.colors.dimmed,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  separator: {
    height: 0.5,
    width: "100%",
    backgroundColor: theme.colors.borderSubtle,
    marginLeft: theme.gap(2),
  },
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.gap(4),
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.gap(1),
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  filterButtonText: {
    fontSize: 13,
    fontFamily: "InstrumentSans_500Medium",
    color: theme.colors.textSecondary,
  },
  filterButton: {
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1),
  },
}));
