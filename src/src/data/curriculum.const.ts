export type Course = {
  id: string;
  name: string;
  semester: number;
  prerequisites: string[]; // list of course ids
};

export const COMPUTER_SCIENCE_CURRICULUM: Course[] = [
  // Semester 1
  {
    id: "c1",
    name: "Intro to Programming",
    semester: 1,
    prerequisites: [],
  },
  {
    id: "c2",
    name: "Discrete Math",
    semester: 1,
    prerequisites: [],
  },
  {
    id: "c3",
    name: "Calculus I",
    semester: 1,
    prerequisites: [],
  },
  {
    id: "c4",
    name: "English Composition",
    semester: 1,
    prerequisites: [],
  },
  {
    id: "c33",
    name: "Introduction to Computer Science",
    semester: 1,
    prerequisites: [],
  },
  // Semester 2
  {
    id: "c5",
    name: "Data Structures",
    semester: 2,
    prerequisites: ["c1"],
  },
  {
    id: "c6",
    name: "Computer Organization",
    semester: 2,
    prerequisites: ["c1"],
  },
  {
    id: "c7",
    name: "Calculus II",
    semester: 2,
    prerequisites: ["c3"],
  },
  {
    id: "c8",
    name: "Physics I",
    semester: 2,
    prerequisites: [],
  },
  // Semester 3
  {
    id: "c9",
    name: "Algorithms",
    semester: 3,
    prerequisites: ["c5", "c2"],
  },
  {
    id: "c10",
    name: "Databases",
    semester: 3,
    prerequisites: ["c5"],
  },
  {
    id: "c11",
    name: "Linear Algebra",
    semester: 3,
    prerequisites: ["c7"],
  },
  {
    id: "c12",
    name: "Digital Logic Design",
    semester: 3,
    prerequisites: ["c6"],
  },
  {
    id: "c34",
    name: "Computer Architecture",
    semester: 3,
    prerequisites: ["c6"],
  },
  {
    id: "c35",
    name: "Software Development Lab",
    semester: 3,
    prerequisites: ["c5"],
  },
  // Semester 4
  {
    id: "c13",
    name: "Operating Systems",
    semester: 4,
    prerequisites: ["c5", "c6"],
  },
  {
    id: "c14",
    name: "Computer Networks",
    semester: 4,
    prerequisites: ["c6"],
  },
  {
    id: "c15",
    name: "Probability & Statistics",
    semester: 4,
    prerequisites: ["c7"],
  },
  {
    id: "c16",
    name: "Web Development",
    semester: 4,
    prerequisites: ["c10"],
  },
  // Semester 5
  {
    id: "c17",
    name: "Software Engineering",
    semester: 5,
    prerequisites: ["c9", "c10"],
  },
  {
    id: "c18",
    name: "Computer Graphics",
    semester: 5,
    prerequisites: ["c11", "c5"],
  },
  {
    id: "c19",
    name: "Theory of Computation",
    semester: 5,
    prerequisites: ["c9", "c2"],
  },
  {
    id: "c20",
    name: "Machine Learning Basics",
    semester: 5,
    prerequisites: ["c11", "c15"],
  },
  {
    id: "c36",
    name: "Human-Computer Interaction",
    semester: 5,
    prerequisites: ["c16"],
  },
  // Semester 6
  {
    id: "c21",
    name: "Artificial Intelligence",
    semester: 6,
    prerequisites: ["c20"],
  },
  {
    id: "c22",
    name: "Cybersecurity",
    semester: 6,
    prerequisites: ["c14", "c13"],
  },
  {
    id: "c23",
    name: "Cloud Computing",
    semester: 6,
    prerequisites: ["c13", "c14"],
  },
  {
    id: "c24",
    name: "Mobile App Development",
    semester: 6,
    prerequisites: ["c17"],
  },
  // Semester 7
  {
    id: "c25",
    name: "Distributed Systems",
    semester: 7,
    prerequisites: ["c23"],
  },
  {
    id: "c26",
    name: "Advanced Algorithms",
    semester: 7,
    prerequisites: ["c17"],
  },
  {
    id: "c27",
    name: "Software Architecture",
    semester: 7,
    prerequisites: ["c17"],
  },
  {
    id: "c28",
    name: "Data Mining",
    semester: 7,
    prerequisites: ["c20"],
  },
  {
    id: "c37",
    name: "Compiler Design",
    semester: 7,
    prerequisites: ["c18"],
  },
  {
    id: "c38",
    name: "DevOps & CI/CD",
    semester: 7,
    prerequisites: ["c23"],
  },
  // Semester 8
  {
    id: "c29",
    name: "Senior Capstone Project",
    semester: 8,
    prerequisites: ["c27"],
  },
  {
    id: "c30",
    name: "Computer Ethics",
    semester: 8,
    prerequisites: [],
  },
  {
    id: "c31",
    name: "Blockchain Technology",
    semester: 8,
    prerequisites: ["c25"],
  },
  {
    id: "c32",
    name: "Natural Language Processing",
    semester: 8,
    prerequisites: ["c21"],
  },
];
