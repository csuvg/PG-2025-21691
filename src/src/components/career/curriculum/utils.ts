import type { Course } from "@/data/curriculum.const";
import type { Edge, NodeCenter } from "./types";

export function groupCoursesBySemester(courses: Course[]) {
  return courses.reduce(
    (acc, course) => {
      acc[course.semester] = [...(acc[course.semester] || []), course];
      return acc;
    },
    {} as Record<number, Course[]>
  );
}

export function buildEdges(
  courses: Course[],
  centers: Record<string, NodeCenter>
): Edge[] {
  const edges: Edge[] = [];
  const byId: Record<string, Course> = {};
  courses.forEach(c => (byId[c.id] = c));

  courses.forEach(course => {
    course.prerequisites.forEach(pid => {
      const pre = byId[pid];
      if (!pre) return;
      if (pre.semester + 1 !== course.semester) return; // only consecutive
      const from = centers[pid];
      const to = centers[course.id];
      if (from && to) {
        edges.push({
          from: {
            x: from.rightX,
            y: from.y,
            leftX: from.leftX,
            rightX: from.rightX,
          },
          to: { x: to.leftX, y: to.y, leftX: to.leftX, rightX: to.rightX },
          key: `${pid}->${course.id}`,
        });
      }
    });
  });

  return edges;
}

export function cubicPath(
  from: NodeCenter,
  to: NodeCenter,
  curvature = 0.5
): string {
  const dx = to.x - from.x;
  const cx1 = from.x + dx * curvature;
  const cy1 = from.y;
  const cx2 = to.x - dx * curvature;
  const cy2 = to.y;
  return `M ${from.x} ${from.y} C ${cx1} ${cy1} ${cx2} ${cy2} ${to.x} ${to.y}`;
}
