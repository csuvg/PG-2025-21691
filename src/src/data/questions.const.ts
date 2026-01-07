import type { Option, Question } from "@/stores/quiz";

// ---------- Reusable Scales ----------
const SCALE_AGREE_1_7: Option[] = [
  { id: "s1", label: "Totalmente en desacuerdo", value: 1 },
  { id: "s2", label: "En desacuerdo", value: 2 },
  { id: "s3", label: "Algo en desacuerdo", value: 3 },
  { id: "s4", label: "Ni de acuerdo ni en desacuerdo", value: 4 },
  { id: "s5", label: "Algo de acuerdo", value: 5 },
  { id: "s6", label: "De acuerdo", value: 6 },
  { id: "s7", label: "Totalmente de acuerdo", value: 7 },
];

const SCALE_GRIT_1_5: Option[] = [
  { id: "g1", label: "Muy parecido a mí", value: 5 },
  { id: "g2", label: "Bastante parecido a mí", value: 4 },
  { id: "g3", label: "Algo parecido a mí", value: 3 },
  { id: "g4", label: "Poco parecido a mí", value: 2 },
  { id: "g5", label: "Nada parecido a mí", value: 1 },
];

const SCALE_RIASEC_1_5: Option[] = [
  { id: "r1", label: "Totalmente en desacuerdo", value: 1 },
  { id: "r2", label: "En desacuerdo", value: 2 },
  { id: "r3", label: "Ni de acuerdo ni en desacuerdo", value: 3 },
  { id: "r4", label: "De acuerdo", value: 4 },
  { id: "r5", label: "Totalmente de acuerdo", value: 5 },
];

// PIAAC scales
const PIAAC_READING_2_COLS: Option[] = [
  { id: "pan", label: "Pan" },
  { id: "galleta", label: "Galleta" },
  { id: "ambos", label: "Ambos" },
];

const SCALE_PIAAC_PROBLEM_SOLVING_5to1: Option[] = [
  { id: "ps_5", label: "5", value: 5 },
  { id: "ps_4", label: "4", value: 4 },
  { id: "ps_3", label: "3", value: 3 },
  { id: "ps_2", label: "2", value: 2 },
  { id: "ps_1", label: "1", value: 1 },
];

// PAA scales
const SCALE_PAA_REDACCION_1: Option[] = [
  {
    id: "r1_1",
    label: "... una de las edificaciones más destacadas de este pueblo... (1)",
  },
  { id: "r1_2", label: "Es una antigua estructura... (2)" },
  { id: "r1_3", label: "Está situado frente a la plaza pública... (3)" },
  { id: "r1_5", label: "Fue construido en el 1938,... (5)" },
];

const SCALE_PAA_REDACCION_2: Option[] = [
  { id: "r2_1", label: "... Ciudad de los Brujos,... (1)" },
  {
    id: "r2_2a",
    label: "... sobresale entre las abundantes construcciones... (2)",
  },
  {
    id: "r2_2b",
    label: "... rompe con el patrón arquitectónico tradicional... (2)",
  },
  { id: "r2_4", label: "... parece haberse detenido el tiempo. (4)" },
];

const SCALE_PAA_ENGLISH_1: Option[] = [
  { id: "w1", label: "works" },
  { id: "w2", label: "worked" },
  { id: "w3", label: "didn’t work" },
  { id: "w4", label: "doesn’t work" },
];

const SCALE_PAA_ENGLISH_2: Option[] = [
  { id: "e2_1", label: "telephone the company." },
  { id: "e2_2", label: "wait for an invitation." },
  { id: "e2_3", label: "come to the office." },
  { id: "e2_4", label: "email a note." },
];

const SCALE_PAA_MATH_1: Option[] = [
  { id: "m1_2", label: "2" },
  { id: "m1_2_5", label: "2.5" },
  { id: "m1_3", label: "3" },
  { id: "m1_3_5", label: "3.5" },
];

const SCALE_PAA_MATH_2: Option[] = [
  { id: "m2_4", label: "4" },
  { id: "m2_8", label: "8" },
  { id: "m2_16", label: "16" },
  { id: "m2_32", label: "32" },
];

const SCALE_PIAAC_NUM_2_TEMPS: Option[] = [
  { id: "t_-13_7", label: "-13.7 °C" },
  { id: "t_+13_7", label: "+13.7 °C" },
  { id: "t_-14_3", label: "-14.3 °C" },
  { id: "t_+14_3", label: "+14.3 °C" },
  { id: "t_-16_7", label: "-16.7 °C" },
  { id: "t_+16_7", label: "+16.7 °C" },
];

// ---------- Questions ----------
// Note: Questions are now fetched dynamically from the API.
// This hardcoded data is kept for reference only and is not used in the app.
export const QUESTIONS: Question[] = [
  // --- METADATA ---
  {
    id: "metadata_gender",
    section: "metadata",
    type: "radio",
    prompt: "Por favor, indique su género:",
    options: [
      { id: "gender_m", label: "Masculino" },
      { id: "gender_f", label: "Femenino" },
      { id: "gender_nd", label: "Prefiero no decir" },
    ],
  },
  // --- PIAAC (Lectura) ---
  {
    id: "piaac_reading_1",
    section: "piaac_reading",
    type: "time",
    prompt:
      "¿A qué hora, como muy tarde, deben llegar los niños a la escuela infantil?",
    meta: {
      timeLimitInSeconds: 400,
      title: "Normas de la escuela infantil",
      block: `**¡Bienvenidos a nuestra escuela infantil!**

Esperamos disfrutar de un gran año de diversión, aprendizaje y conocimiento mutuo. Por favor, tómese un momento para revisar las normas de nuestra escuela infantil.

- Por favor, traiga a su hijo/a no más tarde de las 09:00 h.
- Vista a su hijo/a de forma cómoda y traiga una muda de ropa.
- Por favor, no traiga joyas o caramelos. Si su hijo/a cumple años, por favor, hable con su profesor/a sobre alguna chuchería especial para los niños.
- Por favor, traiga a su hijo/a bien vestido, no en pijama.
- El desayuno se servirá hasta las 07:30 h.
- Traiga una manta o almohada pequeñas. Por favor, deje los juguetes en casa.
- La medicación tiene que venir en su envase original, etiquetada, y hay que firmar la hoja de medicación que hay en cada aula.`,
    },
    options: [],
  },

  // PIAAC Lectura 2 — matriz (filas x columnas)
  {
    id: "piaac_reading_2",
    section: "piaac_reading",
    type: "matrix",
    prompt: "Selecciona para cada afirmación si aplica a Pan, Galleta o Ambos.",
    meta: {
      timeLimitInSeconds: 60,
      tableId: "piaac_reading_2",
      title: "Pan y galletas",
      block: `**El pan se endurece, pero las galletas saladas se ablandan.**

¿Por qué el pan se endurece y estropea cuando se expone al aire? Parte de la explicación se debe a que pierde humedad. El pan blando corriente tiene entre un **32 y 38 %** de humedad. Si dejamos el pan sin envolver y expuesto a los elementos, pierde humedad frente al aire y terminará endureciéndose cuando el nivel de humedad desciende al **14 %**, aproximadamente.

Al tiempo que la humedad del pan se evapora, se da un proceso llamado *retrogradación* por el cual la estructura del almidón cambia. Durante la retrogradación, la corteza del pan se ablanda y la parte media del pan se endurece. Además, una parte del almidón se cristaliza. Cuando esto sucede, se produce un endurecimiento del pan al tiempo que se estropea.

Los almidones duros, como el de las galletas saladas, son crujientes porque están elaborados bajo un nivel de humedad extremadamente bajo, normalmente entre el **2 y el 5 %**. Cuando se exponen al aire, las galletas saladas absorben la humedad del aire. Las galletas parecen blandas cuando su nivel de humedad alcanza un **9 %**, aproximadamente.`,
      rows: [
        { id: "r1", label: "Debe envolverse para mantenerse fresco" },
        { id: "r2", label: "Más fresco cuando está blando" },
        { id: "r3", label: "Le afecta la exposición al aire" },
      ],
    },
    options: PIAAC_READING_2_COLS,
  },

  // --- PIAAC (Numérica) ---
  {
    id: "piaac_numerica_1",
    section: "piaac_numeric",
    type: "number",
    prompt:
      "Cuántos kg de mezcla de mortero necesita para un muro que mide 5 por 4 metros?",
    meta: {
      min: 10,
      max: 100,
      unit: "kg",
      image: "mezcla_mortero.png",
      imageUrl:
        "https://pbs.twimg.com/media/GxMc679XgAAON0Q?format=jpg&name=large",
    },
    options: [],
  },
  {
    id: "piaac_numerica_2",
    section: "piaac_numeric",
    type: "scale",
    prompt:
      "La temperatura actual es -15.2°C y desciende 1.5°C. ¿Cuál será la nueva temperatura?",
    meta: { image: "camara_frigorifica.png" },
    options: SCALE_PIAAC_NUM_2_TEMPS,
  },

  // --- PIAAC (Resolución de problemas) ---
  {
    id: "piaac_problem_solving",
    section: "piaac_problem",
    type: "scale",
    prompt:
      "¿Cuál de las cinco muestras cumple con todos los requisitos de control de calidad?",
    meta: { image: "problem_solving.png" },
    options: SCALE_PIAAC_PROBLEM_SOLVING_5to1,
  },

  // --- PAA Redacción ---
  {
    id: "paa_redaccion_1",
    section: "paa_redaccion",
    type: "scale",
    prompt: " ¿Cuál opción recoge mejor su contenido general?",
    meta: {
      title: "Teatro de Guayama (1-7)",
      block: `(1) En la zona histórica de Guayama, Ciudad de los Brujos, se encuentra el Teatro Guayama conocido antes como Teatro Calimano, una de las edificaciones más destacadas de este pueblo costero del sur de Puerto Rico. (2) Es una antigua estructura que sobresale entre las abundantes construcciones de influencia criolla y francesa por su estilo Art Deco que rompe con el patrón arquitectónico tradicional del centro urbano. (3) Está situado frente a la plaza pública en la calle Derke, una de las calles del casco urbano del pueblo. (4) En sus paredes, parece haberse detenido el tiempo. (5) Fue construido en el 1938, (6) remodelado en el año 1993 (7) y aún conserva su fachada original.

(8) La estructura externa del teatro es digna de admirarse. (9) La edificación posee dos niveles de gran elegancia. (10) Lo primero que sorprende al que llega, visitante isleño o extranjero, es la solidez de sus formas; (11) pero, sobre todo, destaca el diseño utilizado en su decoración. (12) Líneas horizontales y verticales en la fachada hacen gala de un armonioso contraste que recrea la vista e invita a examinar el resto de la estructura con detalle. (13) Se puede disfrutar de su amplia entrada, de sus estilizadas ventanas geométricamente colocadas y de la amplitud del ventanal grande. (14) Asimismo, su boletería llama la atención porque conserva su atractiva construcción en madera, material utilizado para decorar en el estilo Art Deco. (15) Es como una invitación a disfrutar de los secretos que guarda el interior del Teatro.`,
    },
    options: SCALE_PAA_REDACCION_1,
  },
  {
    id: "paa_redaccion_2",
    section: "paa_redaccion",
    type: "scale",
    prompt:
      "¿Cuál enunciado añade información y enriquece ESTILÍSTICAMENTE la secuencia (1–7) sin negar lo expresado?",
    meta: {
      title: "Teatro de Guayama (8-15)",
      block: `(1) En la zona histórica de Guayama, Ciudad de los Brujos, se encuentra el Teatro Guayama conocido antes como Teatro Calimano, una de las edificaciones más destacadas de este pueblo costero del sur de Puerto Rico. (2) Es una antigua estructura que sobresale entre las abundantes construcciones de influencia criolla y francesa por su estilo Art Deco que rompe con el patrón arquitectónico tradicional del centro urbano. (3) Está situado frente a la plaza pública en la calle Derke, una de las calles del casco urbano del pueblo. (4) En sus paredes, parece haberse detenido el tiempo. (5) Fue construido en el 1938, (6) remodelado en el año 1993 (7) y aún conserva su fachada original.

(8) La estructura externa del teatro es digna de admirarse. (9) La edificación posee dos niveles de gran elegancia. (10) Lo primero que sorprende al que llega, visitante isleño o extranjero, es la solidez de sus formas; (11) pero, sobre todo, destaca el diseño utilizado en su decoración. (12) Líneas horizontales y verticales en la fachada hacen gala de un armonioso contraste que recrea la vista e invita a examinar el resto de la estructura con detalle. (13) Se puede disfrutar de su amplia entrada, de sus estilizadas ventanas geométricamente colocadas y de la amplitud del ventanal grande. (14) Asimismo, su boletería llama la atención porque conserva su atractiva construcción en madera, material utilizado para decorar en el estilo Art Deco. (15) Es como una invitación a disfrutar de los secretos que guarda el interior del Teatro.`,
    },
    options: SCALE_PAA_REDACCION_2,
  },

  // --- BFI (15 ítems, 1..7, con reversos) ---
  ...[
    ["bfi_1", "Se preocupa mucho", false],
    ["bfi_2", "Se pone nervioso fácilmente", false],
    ["bfi_3", "Permanece tranquilo en situaciones tensas", true],
    ["bfi_4", "Es hablador", false],
    ["bfi_5", "Es extrovertido, sociable", false],
    ["bfi_6", "Es reservado", true],
    ["bfi_7", "Es original, tiene nuevas ideas", false],
    ["bfi_8", "Valora las experiencias artísticas y estéticas", false],
    ["bfi_9", "Tiene una imaginación activa", false],
    ["bfi_10", "A veces es grosero con los demás", true],
    ["bfi_11", "Tiene una naturaleza indulgente", false],
    ["bfi_12", "Es considerado y amable con casi todos", false],
    ["bfi_13", "Hace un trabajo minucioso", false],
    ["bfi_14", "Tiende a ser perezoso", true],
    ["bfi_15", "Hace las cosas de manera eficiente", false],
  ].map<Question>(([id, label, reverse]) => ({
    id: id as string,
    section: "bfi",
    type: "scale",
    prompt: String(label),
    reverse: Boolean(reverse),
    options: SCALE_AGREE_1_7,
  })),

  // --- RIASEC (12 ítems, 1..5) ---
  ...[
    "Me gusta construir cosas",
    "Me gusta trabajar al aire libre",
    "Disfruto intentando averiguar cómo funcionan las cosas",
    "Me gusta analizar cosas (problemas/situaciones)",
    "Soy una persona creativa",
    "Se me da bien trabajar de forma independiente",
    "Me gusta trabajar en equipo",
    "Me gusta intentar ayudar a la gente a resolver sus problemas",
    "Me gusta liderar",
    "Asumo rápidamente nuevas responsabilidades",
    "Me gusta organizar cosas (archivos, escritorios/oficinas)",
    "Presto atención a los detalles",
  ].map<Question>((label, i) => ({
    id: `riasec_${i + 1}`,
    section: "riasec",
    type: "scale",
    prompt: label,
    options: SCALE_RIASEC_1_5,
  })),

  // --- GRIT-S (8 ítems, 1..5; {reverse} para 2,4,7,8) ---
  ...[
    [
      "grit_1",
      "Las nuevas ideas y proyectos a veces me distraen de los anteriores.",
      false,
    ],
    ["grit_2", "{reverse} Los contratiempos no me desaniman.", true],
    [
      "grit_3",
      "He estado obsesionado con una idea o proyecto por un corto tiempo, pero luego perdí el interés.",
      false,
    ],
    ["grit_4", "{reverse} Soy un trabajador arduo.", true],
    [
      "grit_5",
      "A menudo establezco una meta, pero luego decido perseguir una diferente.",
      false,
    ],
    [
      "grit_6",
      "Tengo dificultad para mantener mi enfoque en proyectos que toman más de unos pocos meses en completarse.",
      false,
    ],
    ["grit_7", "{reverse} Termino todo lo que comienzo.", true],
    ["grit_8", "{reverse} Soy diligente.", true],
  ].map<Question>(([id, label, reverse]) => ({
    id: id as string,
    section: "grit",
    type: "scale",
    prompt: String(label).replace("{reverse} ", ""),
    reverse: Boolean(reverse),
    options: SCALE_GRIT_1_5,
  })),

  // --- PAA English ---
  {
    id: "paa_english_1",
    section: "paa_english",
    type: "scale",
    prompt: "Sandra - - - - yesterday because she was injured.",
    options: SCALE_PAA_ENGLISH_1,
  },
  {
    id: "paa_english_2",
    section: "paa_english",
    type: "scale",
    prompt: "To apply, interested people must",
    meta: { image: "paa_english_2.png" },
    options: SCALE_PAA_ENGLISH_2,
  },

  // --- PAA Math ---
  {
    id: "paa_math_1",
    section: "paa_math",
    type: "scale",
    prompt:
      "En la gráfica, ¿cuál es la mediana de la cantidad de visitas realizadas al club deportivo?",
    meta: { image: "paa_math_1.png" },
    options: SCALE_PAA_MATH_1,
  },
  {
    id: "paa_math_2",
    section: "paa_math",
    type: "scale",
    prompt: "¿Cuál de las siguientes opciones es solución de 4x^2 – 8 = 56?",
    options: SCALE_PAA_MATH_2,
  },
];
