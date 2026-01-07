import type { Course } from "@/data/curriculum.const";
import React from "react";
import type { View as RNView } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { COLUMN_W } from "./constants";
import CourseCard from "./course-card";
import type { NodeRect } from "./types";

export default function SemesterColumn({
  courses,
  columnIndex,
  onMeasureCourse,
  hostRef,
  onPressCourse,
  selectedCourseId,
  highlightedCourseIds,
}: {
  courses: Course[];
  columnIndex: number;
  onMeasureCourse: (
    courseId: string,
    columnIndex: number,
    rect: NodeRect
  ) => void;
  hostRef: React.RefObject<RNView>;
  onPressCourse?: (course: Course) => void;
  selectedCourseId?: string | null;
  highlightedCourseIds?: Set<string>;
}) {
  return (
    <Animated.View style={[styles.semesterColumn]} key={columnIndex}>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          hostRef={hostRef}
          onMeasure={(id, rect) => onMeasureCourse(id, columnIndex, rect)}
          onPress={onPressCourse}
          isSelected={selectedCourseId === course.id}
          isDimmed={
            highlightedCourseIds ? !highlightedCourseIds.has(course.id) : false
          }
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create(theme => ({
  semesterColumn: {
    width: COLUMN_W,
    backgroundColor: "transparent",
    padding: theme.gap(2),
    gap: theme.gap(2),
    alignItems: "stretch",
    justifyContent: "center",
  },
}));
