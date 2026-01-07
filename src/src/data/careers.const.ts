export interface Career {
  id: string;
  name: string;
  duration: string;
  compatibility: number; // 0 to 1 (percentage as decimal)
  rank: number;
  accentColor: string;
  coverImageUrl?: string;
  description: string;
  keySkills: string[];
  averageSalary: string;
  jobGrowth: string;
  employability: string;
  faculty: string;
}

export const CAREER_RECOMMENDATIONS: Career[] = [
  {
    id: "data-engineering",
    name: "Ingeniería de datos",
    duration: "4 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.89,
    rank: 2,
    accentColor: "#0EA5E9", // blue
    coverImageUrl:
      "https://www.theforage.com/blog/wp-content/uploads/2023/02/what-is-a-data-engineer.jpg",
    description:
      "Diseña y construye sistemas para recopilar, almacenar y analizar grandes volúmenes de datos",
    keySkills: ["Python", "SQL", "Big Data", "Machine Learning", "ETL"],
    averageSalary: "$95,000 - $140,000",
    jobGrowth: "+22% (2021-2031)",
  },
  {
    id: "mechatronics",
    name: "Mecatrónica",
    duration: "5 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.94,
    rank: 1,
    accentColor: "#F59E0B", // amber
    coverImageUrl:
      "https://detrujillo.com/wp-content/uploads/2018/10/ingenieria-mecatronica-1.gif",
    description:
      "Combina ingeniería mecánica, electrónica y computacional para crear sistemas automatizados",
    keySkills: [
      "Automatización",
      "Robótica",
      "CAD",
      "Programación",
      "Electrónica",
    ],
    averageSalary: "$75,000 - $120,000",
    jobGrowth: "+15% (2021-2031)",
  },
  {
    id: "computer-science",
    name: "Computación",
    duration: "4 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.87,
    rank: 3,
    accentColor: "#10B981", // emerald
    description:
      "Desarrolla software, aplicaciones y sistemas computacionales para resolver problemas complejos",
    coverImageUrl:
      "https://www.dc.uba.ar/wp-content/uploads/2023/03/salida-laboral-computacion.jpg",
    keySkills: [
      "Programación",
      "Algoritmos",
      "Desarrollo Web",
      "Bases de datos",
      "Ciberseguridad",
    ],
    averageSalary: "$85,000 - $150,000",
    jobGrowth: "+13% (2021-2031)",
  },
  {
    id: "industrial-design",
    name: "Diseño Industrial",
    duration: "4 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.82,
    rank: 4,
    accentColor: "#8B5CF6", // violet
    coverImageUrl:
      "https://bsdi.es/wp-content/uploads/2024/11/diseno-industrial-historia.jpg",
    description:
      "Crea productos funcionales y estéticamente atractivos considerando usabilidad y manufactura",
    keySkills: [
      "Design Thinking",
      "Prototipado",
      "CAD",
      "Investigación UX",
      "Materiales",
    ],
    averageSalary: "$65,000 - $95,000",
    jobGrowth: "+3% (2021-2031)",
  },
  {
    id: "biomedical-engineering",
    name: "Ingeniería Biomédica",
    duration: "5 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.79,
    rank: 5,
    accentColor: "#EC4899", // pink
    description:
      "Aplica principios de ingeniería para resolver problemas en medicina y biología",
    keySkills: [
      "Biotecnología",
      "Dispositivos médicos",
      "Análisis de datos",
      "Regulación",
      "Bioinformática",
    ],
    averageSalary: "$70,000 - $110,000",
    jobGrowth: "+6% (2021-2031)",
  },
  {
    id: "architecture",
    name: "Arquitectura",
    duration: "5 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.76,
    rank: 6,
    accentColor: "#F97316", // orange
    description:
      "Diseña y planifica espacios habitables funcionales, seguros y estéticamente agradables",
    keySkills: [
      "Diseño arquitectónico",
      "AutoCAD",
      "Sostenibilidad",
      "Gestión de proyectos",
      "Normativas",
    ],
    averageSalary: "$60,000 - $100,000",
    jobGrowth: "+3% (2021-2031)",
  },
  {
    id: "psychology",
    name: "Psicología",
    duration: "5 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.71,
    rank: 7,
    accentColor: "#A855F7", // purple
    description:
      "Estudia el comportamiento humano y los procesos mentales para ayudar a individuos y comunidades",
    keySkills: [
      "Terapia",
      "Investigación",
      "Comunicación",
      "Empatía",
      "Análisis conductual",
    ],
    averageSalary: "$50,000 - $80,000",
    jobGrowth: "+8% (2021-2031)",
  },
  {
    id: "medicine",
    name: "Medicina",
    duration: "7 años ",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.68,
    rank: 8,
    accentColor: "#DC2626", // red
    description:
      "Diagnóstica, trata y previene enfermedades para mejorar la salud de las personas",
    keySkills: [
      "Diagnóstico",
      "Cirugía",
      "Farmacología",
      "Anatomía",
      "Cuidado del paciente",
    ],
    averageSalary: "$150,000 - $300,000",
    jobGrowth: "+3% (2021-2031)",
  },
  {
    id: "graphic-design",
    name: "Diseño Gráfico",
    duration: "4 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.65,
    rank: 9,
    accentColor: "#E11D48", // rose
    description:
      "Crea comunicación visual efectiva a través de tipografía, imágenes y elementos gráficos",
    keySkills: [
      "Adobe Creative Suite",
      "Branding",
      "Tipografía",
      "Marketing visual",
      "UI/UX Design",
    ],
    averageSalary: "$45,000 - $70,000",
    jobGrowth: "+3% (2021-2031)",
  },
  {
    id: "business-administration",
    name: "Administración de Empresas",
    duration: "4 años",
    employability: "muy alta",
    faculty: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
    compatibility: 0.62,
    rank: 10,
    accentColor: "#0891B2", // cyan
    description:
      "Gestiona recursos empresariales y desarrolla estrategias para el crecimiento organizacional",
    keySkills: [
      "Liderazgo",
      "Análisis financiero",
      "Marketing",
      "Gestión de proyectos",
      "Estrategia empresarial",
    ],
    averageSalary: "$60,000 - $120,000",
    jobGrowth: "+8% (2021-2031)",
  },
];
