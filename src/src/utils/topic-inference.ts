const STOPWORDS = new Set([
  "de",
  "la",
  "el",
  "en",
  "y",
  "que",
  "un",
  "una",
  "los",
  "las",
  "por",
  "para",
  "con",
  "me",
  "mi",
  "del",
  "al",
  "lo",
  "a",
  "es",
  "se",
  "su",
  "como",
  "si",
  "todo",
  "muy",
  "mas",
  "ya",
  "hay",
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-záéíóúüñ\s]/gi, "")
    .split(/\s+/)
    .filter(w => w && !STOPWORDS.has(w));
}

/*
    Jaccard similarity index is a measure of how similar two sets of words are.
*/
function jaccard(a: string, b: string): number {
  const aWords = new Set(normalize(a));
  const bWords = new Set(normalize(b));
  const inter = [...aWords].filter(w => bWords.has(w)).length;
  const union = new Set([...aWords, ...bWords]).size;
  return inter / union;
}

const TOPIC_EXAMPLES: Record<string, string[]> = {
  carreras: [
    "que carrera puedo estudiar",
    "opciones de estudio",
    "programas universitarios",
  ],
  universidades: [
    "donde estudiar",
    "usac uvg landivar galileo",
    "universidades de guatemala",
  ],
  requisitos_admision: [
    "requisitos de admision",
    "examen de ingreso",
    "que piden para entrar",
  ],
  pensum: [
    "materias del pensum",
    "cursos que lleva",
    "cuanto dura la carrera",
    "plan de estudios",
  ],
  afinidad_perfil: [
    "segun mi test",
    "mi resultado dice",
    "que carrera me recomiendas",
  ],
  combinaciones: [
    "combinar carreras",
    "doble carrera",
    "mezclar psicologia con marketing",
  ],
  vida_universitaria: [
    "vida de estudiante",
    "es dificil la universidad",
    "tiempo libre",
    "estres",
  ],
  becas_oportunidades: [
    "hay becas",
    "ayuda economica",
    "financiamiento",
    "apoyo estudiantil",
  ],
  empleabilidad_general: [
    "en que puedo trabajar",
    "campo laboral",
    "salida laboral",
  ],
  proceso_vocacional: [
    "no se que estudiar",
    "como elegir carrera",
    "orientacion vocacional",
    "estoy indeciso",
  ],
  tecnologia_ia: [
    "inteligencia artificial",
    "programacion",
    "tecnologia",
    "ingenieria en sistemas",
  ],
};

export function inferTopic(prompt: string): string {
  let best = "otro";
  let bestScore = 0;
  for (const [topic, examples] of Object.entries(TOPIC_EXAMPLES)) {
    for (const ex of examples) {
      const score = jaccard(prompt, ex);
      if (score > bestScore) {
        bestScore = score;
        best = topic;
      }
    }
  }
  return bestScore >= 0.2 ? best : "otro";
}
