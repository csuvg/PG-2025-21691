import type { Pensum, PensumCourse } from "@/api/career";
import { useCareer } from "@/api/career";
import { SNAP } from "@/components/career/curriculum/constants";
import LinesOverlay from "@/components/career/curriculum/lines-overlay";
import SemesterColumn from "@/components/career/curriculum/semester-column";
import SemesterOverlay from "@/components/career/curriculum/semester-overlay";
import type {
  NodeCenters,
  NodeRect,
} from "@/components/career/curriculum/types";
import {
  buildEdges,
  groupCoursesBySemester,
} from "@/components/career/curriculum/utils";
import AppBackground from "@/components/ui/app-background";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import type { Course } from "@/data/curriculum.const";
import { useNavigationClose } from "@/hooks/use-navigation-close";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@roninoss/icons";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, View, type View as RNView } from "react-native";
import Animated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollOffset,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

/**
 * Transforms the API's Pensum structure (organized by year/semester)
 * into a flat array of courses with semester numbers.
 * Handles prerequisites which can be either PensumCourse[] or string[].
 */
function transformPensumToCourses(pensum: Pensum): Course[] {
  const courses: Course[] = [];
  let semesterNumber = 1;

  // Helper function to extract prerequisite IDs
  const extractPrerequisiteIds = (
    prerequisitos: PensumCourse[] | string[]
  ): string[] => {
    if (!prerequisitos || prerequisitos.length === 0) return [];

    // If first item is a string, assume all are strings
    if (typeof prerequisitos[0] === "string") {
      return prerequisitos as string[];
    }

    // Otherwise, extract _id from PensumCourse objects
    return (prerequisitos as PensumCourse[])
      .map(course => course?._id)
      .filter((id): id is string => !!id);
  };

  // Iterate through each year in the pensum
  for (const yearData of pensum) {
    if (!yearData) continue;

    // First semester of the year
    if (yearData.first_semester && yearData.first_semester.length > 0) {
      yearData.first_semester.forEach(course => {
        courses.push({
          id: course._id,
          name: course.nombre,
          semester: semesterNumber,
          prerequisites: extractPrerequisiteIds(course.prerequisitos || []),
        });
      });
      semesterNumber++;
    }

    // Second semester of the year
    if (yearData.second_semester && yearData.second_semester.length > 0) {
      yearData.second_semester.forEach(course => {
        courses.push({
          id: course._id,
          name: course.nombre,
          semester: semesterNumber,
          prerequisites: extractPrerequisiteIds(course.prerequisitos || []),
        });
      });
      semesterNumber++;
    }
  }

  return courses;
}

export default function Curriculum() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: career, isLoading, error } = useCareer(id as string);

  const bottomTabBarHeight = useBottomTabBarHeight();
  const { theme } = useUnistyles();
  const scrollRef = useAnimatedRef<Animated.FlatList>();
  const scrollX = useScrollOffset(scrollRef);

  const hostRef = useRef<RNView | null>(null);

  // Transform API data into curriculum format
  const curriculumCourses = useMemo(() => {
    if (!career?.pensum) return [];
    return transformPensumToCourses(career.pensum);
  }, [career]);

  const coursesBySemester = useMemo(() => {
    return groupCoursesBySemester(curriculumCourses);
  }, [curriculumCourses]);

  const semesters = Object.values(coursesBySemester).sort(
    (a, b) => a[0].semester - b[0].semester
  );

  // Current snapped semester index and overlay opacity

  // registry of node centers in absolute "content" coords (graphHost coords)
  const [centers, setCenters] = useState<NodeCenters>({});

  // State for course selection and sheet
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showLinesOverlay, setShowLinesOverlay] = useState(true);

  const onMeasureCourse = (id: string, columnIndex: number, rect: NodeRect) => {
    // rect.x is already in graphHost coords relative to the host
    const leftX = rect.x;
    const rightX = rect.x + rect.width;
    const centerYAbs = rect.y + rect.height / 2;

    setCenters(prev => ({
      ...prev,
      [id]: { x: centerYAbs /* unused */, y: centerYAbs, leftX, rightX },
    }));
  };

  // compute lines only between consecutive semesters
  const allEdges = useMemo(
    () => buildEdges(curriculumCourses, centers),
    [curriculumCourses, centers]
  );

  // Filter edges to only show for selected course
  const edges = useMemo(() => {
    if (!selectedCourseId) return [];

    // Show edges where the selected course is either the source or target
    return allEdges.filter(edge => edge.key.includes(selectedCourseId));
  }, [allEdges, selectedCourseId]);

  // Set of course IDs to highlight (selected + its neighbors)
  const highlightedCourseIds = useMemo(() => {
    if (!selectedCourseId) return null as null | Set<string>;
    const set = new Set<string>([selectedCourseId]);
    allEdges.forEach(edge => {
      if (edge.key.includes(selectedCourseId)) {
        const [fromId, toId] = edge.key.split("->");
        if (fromId) set.add(fromId);
        if (toId) set.add(toId);
      }
    });
    return set;
  }, [allEdges, selectedCourseId]);

  const contentWidth = semesters.length * SNAP;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const sheetRef = useRef<any>(null);

  // Animated semester/year based on scroll position (UI-thread)
  // Bias rounding by the observed center fraction so centered item maps correctly
  const CENTER_FRACTION = 0.63;
  const animatedSemester = useDerivedValue(() => {
    const rawSemester =
      Math.round(scrollX.value / SNAP - CENTER_FRACTION) + 1 + 1;
    return Math.max(1, rawSemester);
  }, [scrollX]);
  const animatedYear = useDerivedValue(
    () => Math.ceil(animatedSemester.value / 2),
    [animatedSemester]
  );

  const currentSemesterOverlayAnimatedStyle = useAnimatedStyle(() => {
    const fractional = (scrollX.value / SNAP) % 1;

    // Fully visible at 0.63 (center), fade out at 0 and 1 (between semesters)
    return {
      opacity: interpolate(fractional, [0, CENTER_FRACTION, 1], [0, 1, 0]),
      transform: [
        {
          translateX: interpolate(
            fractional,
            [0, CENTER_FRACTION, 1],
            [60, 0, -60]
          ),
        },
      ],
    };
  });
  // Removed JS-thread per-frame updates; semester/year now derived on UI-thread

  const open = async () => {
    try {
      await sheetRef.current?.present();
    } catch (err) {
      console.warn("present failed", err);
    }
  };

  const close = async () => {
    try {
      await sheetRef.current?.dismiss();
    } catch (err) {
      console.warn("dismiss failed", err);
    }
  };

  // Note: this is for a weird bug where the svg lines are visible after a back transition.
  useNavigationClose(navigation, () => setShowLinesOverlay(false));

  // Show loading state
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingBottom: bottomTabBarHeight },
        ]}
      >
        <AppBackground />
        <Stack.Screen
          options={{ headerTitle: "Pensum", headerBackTitle: "Atrás" }}
        />
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Paragraph style={{ color: theme.colors.textSecondary }}>
          Cargando pensum...
        </Paragraph>
      </View>
    );
  }

  // Show error state
  if (error || !career) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingBottom: bottomTabBarHeight },
        ]}
      >
        <AppBackground />
        <Stack.Screen
          options={{ headerTitle: "Pensum", headerBackTitle: "Atrás" }}
        />
        <Icon
          name="exclamationmark.triangle"
          size={48}
          color={theme.colors.dimmed}
          namingScheme="sfSymbol"
        />
        <Heading level={5} style={{ color: theme.colors.textSecondary }}>
          Error al cargar el pensum
        </Heading>
        <Paragraph
          style={{ color: theme.colors.textSecondary, textAlign: "center" }}
        >
          No se pudieron cargar los datos del pensum. Por favor, intenta de
          nuevo.
        </Paragraph>
      </View>
    );
  }

  // Show empty state if no courses
  if (semesters.length === 0) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingBottom: bottomTabBarHeight },
        ]}
      >
        <AppBackground />
        <Stack.Screen
          options={{ headerTitle: "Pensum", headerBackTitle: "Atrás" }}
        />
        <Icon
          name="book.closed"
          size={48}
          color={theme.colors.dimmed}
          namingScheme="sfSymbol"
        />
        <Heading level={5} style={{ color: theme.colors.textSecondary }}>
          No hay datos del pensum
        </Heading>
        <Paragraph
          style={{ color: theme.colors.textSecondary, textAlign: "center" }}
        >
          Esta carrera aún no tiene un pensum disponible.
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomTabBarHeight }]}>
      <AppBackground />
      <Stack.Screen
        options={{ headerTitle: "Pensum", headerBackTitle: "Atrás" }}
      />
      <Animated.View
        style={[
          styles.currentSemesterOverlay,
          currentSemesterOverlayAnimatedStyle,
        ]}
      >
        <SemesterOverlay semester={animatedSemester} year={animatedYear} />
      </Animated.View>
      <View ref={hostRef} style={styles.graphHost}>
        {/* Current semester overlay */}

        {/* Lines overlay */}
        {showLinesOverlay && edges.length > 0 ? (
          <LinesOverlay
            edges={edges}
            width={contentWidth}
            translateX={scrollX}
          />
        ) : null}
        {/* Columns */}
        <Animated.FlatList
          style={styles.curriculum}
          data={semesters}
          keyExtractor={item => item[0].id}
          horizontal
          snapToAlignment="center"
          snapToInterval={SNAP}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          ref={scrollRef}
          contentContainerStyle={[
            styles.curriculumContent,
            { width: contentWidth },
          ]}
          renderItem={({ item, index }) => (
            <SemesterColumn
              courses={item}
              columnIndex={index}
              onMeasureCourse={onMeasureCourse}
              hostRef={hostRef as React.RefObject<RNView>}
              selectedCourseId={selectedCourseId}
              highlightedCourseIds={highlightedCourseIds ?? undefined}
              onPressCourse={c => {
                // Toggle selection for line visibility
                setSelectedCourseId(prev => (prev === c.id ? null : c.id));

                // Auto-scroll to the tapped semester
                const targetOffset = (c.semester - 1) * SNAP;
                scrollTo(scrollRef, targetOffset, 0, true);

                // Also open the detail sheet
                setActiveCourse(c);
                open();
              }}
            />
          )}
        />
      </View>

      {/* <TrueSheet
        ref={sheetRef}
        style={styles.sheet}
        sizes={["medium", "large"]}
        cornerRadius={16}
        backgroundColor={theme.colors.surface}
        dimmed={true}
      >
        <View style={styles.sheetContent}>
          {activeCourse && (
            <>
              <Pressable onPress={() => close()} style={styles.closeButton}>
                <Icon
                  name="xmark"
                  size={16}
                  color={theme.colors.textPrimary}
                  namingScheme="sfSymbol"
                />
              </Pressable>
              <Heading
                level={4}
                style={{
                  textAlign: "center",
                  letterSpacing: -0.35,
                }}
              >
                {activeCourse.name}
              </Heading>
              <Spacer />

              <Paragraph>
                En este curso aprenderás los fundamentos del desarrollo web,
                incluyendo HTML, CSS, JavaScript y las mejores prácticas para
                crear aplicaciones modernas.
              </Paragraph>
              <Spacer />
              <Paragraph>
                Para este curso, deberás haber aprobado los siguientes cursos:
              </Paragraph>
              <Spacer />
              <View style={{ gap: theme.gap(1) }}>
                {["Curso 1", "Curso 2", "Curso 3"].map(course => (
                  <Paragraph key={course} style={styles.preCourse}>
                    {course}
                  </Paragraph>
                ))}
              </View>
            </>
          )}
        </View>
      </TrueSheet> */}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  host: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: theme.gap(2),
    padding: theme.gap(3),
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderBottomWidth: 0,
    flex: 1,
  },
  preCourse: {
    paddingHorizontal: theme.gap(1),
    paddingVertical: theme.gap(0.5),
  },
  sheetContent: {
    padding: 20,
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  closeButton: {
    position: "absolute",
    top: 6,
    left: 6,
    zIndex: 1,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.gap(1),
    borderRadius: theme.radius.full,
  },
  buttonRow: { marginTop: 16 },
  container: { flex: 1 },
  graphHost: { flex: 1, position: "relative" },
  curriculum: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  curriculumContent: {
    gap: 32,
    padding: theme.gap(2),
  },
  currentSemesterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));
