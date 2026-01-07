import Heading from "@/components/ui/heading";
import type { Course } from "@/data/curriculum.const";
import React, { useRef } from "react";
import {
  findNodeHandle,
  LayoutChangeEvent,
  TouchableOpacity,
  UIManager,
  type View as RNView,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { NodeRect } from "./types";

const accentsOpaque = {
  blue: "rgba(9,255,255,0.1)",
  blueish: "rgba(128,163,238,0.1)",
  pink: "rgba(255,54,159,0.1)",
  yellow: "rgba(255,175,33,0.1)",
  lavender: "rgba(159,139,234,0.1)",
};

export function getSemesterColor(
  semester: number,
  colorScheme: "light" | "dark"
) {
  const colors = [
    colorScheme === "light" ? accentsOpaque.blueish : accentsOpaque.blue,
    accentsOpaque.pink,
    accentsOpaque.yellow,
    accentsOpaque.blueish,
    accentsOpaque.lavender,
  ];
  return colors[semester % 5];
}

const accents = {
  blue: "rgba(9,255,255,1)",
  blueish: "rgba(128,163,238,1)",
  pink: "rgba(255,54,159,1)",
  yellow: "rgba(255,175,33,1)",
  lavender: "rgba(159,139,234,1)",
};

export default function CourseCard({
  course,
  hostRef,
  onMeasure,
  onPress,
  isSelected = false,
  isDimmed = false,
}: {
  course: Course;
  hostRef: React.RefObject<RNView>;
  onMeasure: (id: string, rect: NodeRect) => void;
  onPress?: (course: Course) => void;
  isSelected?: boolean;
  isDimmed?: boolean;
}) {
  const ref = useRef<any>(null);
  const { theme, rt } = useUnistyles();
  function handleLayout(_e: LayoutChangeEvent) {
    const node = findNodeHandle(ref.current);
    const hostNode = findNodeHandle(hostRef.current);
    if (!node || !hostNode) return;

    (UIManager as any).measureLayout(
      node,
      hostNode,
      () => {},
      (x: number, y: number, width: number, height: number) => {
        onMeasure(course.id, { x, y, width, height });
      }
    );
  }

  const colorScheme: "light" | "dark" =
    rt.colorScheme === "dark" ? "dark" : "light";
  const semesterColor = getSemesterColor(course.semester, colorScheme);
  const accentColor = [
    colorScheme === "light" ? accents.blueish : accents.blue,
    accents.pink,
    accents.yellow,
    accents.blueish,
    accents.lavender,
  ][course.semester % 5];

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.courseCard,
        {
          backgroundColor: semesterColor,
          borderColor: isSelected ? accentColor : semesterColor,
          borderWidth: isSelected ? 2.5 : 1.5,
          opacity: isDimmed ? 0.35 : isSelected ? 1 : 0.85,
          transform: [{ scale: isSelected ? 1.03 : 1 }],
          shadowColor: isSelected ? accentColor : undefined,
          shadowOpacity: isSelected ? 0.35 : 0,
          shadowRadius: isSelected ? 8 : 0,
          shadowOffset: isSelected ? { width: 0, height: 2 } : undefined,
        },
      ]}
      onLayout={handleLayout}
      onPress={onPress ? () => onPress(course) : undefined}
      activeOpacity={0.8}
    >
      <Heading
        level={7}
        style={{
          textAlign: "center",
          color: accentColor,
          fontWeight: isSelected ? "700" : "600",
        }}
      >
        {course.name}
      </Heading>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create(theme => ({
  courseCard: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    padding: theme.gap(2),
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    alignItems: "center",
  },
}));
