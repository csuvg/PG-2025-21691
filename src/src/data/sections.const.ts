export type SectionIntro = {
  title: string;
  subtitle: string;
};

export const SECTION_INTROS: Record<string, SectionIntro> = {
  metadata: {
    title: "Datos generales",
    subtitle:
      "En la siguiente sección, te haremos unas preguntas rápidas para personalizar tu experiencia. No afectan tus resultados.",
  },
  piaac_reading: {
    title: "Lectura y comprensión",
    subtitle:
      "En la siguiente sección, pondremos a prueba tu comprensión lectora: leerás breves textos y extraerás información clave.",
  },
  piaac_numeric: {
    title: "Razonamiento numérico",
    subtitle:
      "En la siguiente sección, resolverás situaciones cotidianas usando números y unidades.",
  },
  piaac_problem: {
    title: "Resolución de problemas",
    subtitle:
      "En la siguiente sección, elegirás la mejor opción considerando condiciones y restricciones.",
  },
  paa_redaccion: {
    title: "Comprensión de texto (Redacción)",
    subtitle:
      "En la siguiente sección, leerás fragmentos y elegirás la opción que mejor resume o enriquece el contenido.",
  },
  bfi: {
    title: "Rasgos de personalidad",
    subtitle:
      "En la siguiente sección, responderás afirmaciones sencillas sobre tus preferencias y comportamientos.",
  },
  riasec: {
    title: "Intereses vocacionales",
    subtitle:
      "En la siguiente sección, nos contarás qué tipos de actividades te atraen más en estudio y trabajo.",
  },
  grit: {
    title: "Constancia y perseverancia (Grit)",
    subtitle:
      "En la siguiente sección, conoceremos tu constancia y perseverancia hacia metas a largo plazo.",
  },
  paa_english: {
    title: "Inglés (uso y comprensión)",
    subtitle:
      "En la siguiente sección, completarás oraciones en inglés con la opción correcta.",
  },
  paa_math: {
    title: "Matemática (razonamiento)",
    subtitle:
      "En la siguiente sección, resolverás ejercicios con gráficos, ecuaciones y relaciones.",
  },
};
