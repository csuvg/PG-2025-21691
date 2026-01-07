import type { TraitScores } from "@/api/career";
import { accents } from "@/unistyles";

type RiasecKey = keyof TraitScores["riasec"];
type BfiKey = keyof TraitScores["bfi"];

export function mapTraitScoresToSummary(traitScores: TraitScores) {
  const { riasec, bfi, grit, piaac, paa } = traitScores;

  // --- RIASEC ---
  const riasecSorted = (Object.entries(riasec) as [RiasecKey, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const top2: RiasecKey[] = riasecSorted.slice(0, 2).map(([k]) => k);
  const riasecLabels: Record<RiasecKey, string> = {
    R: "Realista",
    I: "Investigativo",
    A: "Artístico",
    S: "Social",
    E: "Emprendedor",
    C: "Convencional",
  };
  const riasecDesc: Record<RiasecKey, string> = {
    R: "práctico y orientado a lo tangible",
    I: "analítico y curioso",
    A: "creativo y expresivo",
    S: "empático y colaborador",
    E: "sociable y con liderazgo",
    C: "organizado y estructurado",
  };

  const riasecText = `Tus intereses más altos son ${riasecLabels[top2[0]]} (${riasecDesc[top2[0]]}) y ${riasecLabels[top2[1]]} (${riasecDesc[top2[1]]}).`;

  // --- BFI ---
  const bfiText = interpretBFI(bfi);

  // --- GRIT ---
  const gritText = interpretGrit(grit);

  // --- PIAAC / PAA ---
  const cognitiveLevel = interpretCognitive({ piaac, paa });

  // --- General summary ---
  const resumen_general = buildGeneralSummary(top2, bfi);

  return {
    resumen_general,
    detalles: {
      riasec: riasecText,
      bfi: bfiText,
      grit: gritText,
      paa_piaac: cognitiveLevel,
    },
  };
}

// New: pill-friendly mapping for profile traits UI

export type TraitPillItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: string; // SF Symbol name
  accentColor: string; // hex/rgb
  detail: string; // longer copy for modal
};

export function mapTraitScoresToPills(
  traitScores: TraitScores
): TraitPillItem[] {
  const { riasec, bfi, grit, piaac, paa } = traitScores;

  // RIASEC top-2 as two distinct pills
  const riasecSorted = (Object.entries(riasec) as [RiasecKey, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const top2: RiasecKey[] = riasecSorted.slice(0, 2).map(([k]) => k);
  const riasecLabels: Record<RiasecKey, string> = {
    R: "Realista",
    I: "Investigativo",
    A: "Artístico",
    S: "Social",
    E: "Emprendedor",
    C: "Convencional",
  };
  const riasecDesc: Record<RiasecKey, string> = {
    R: "práctico y orientado a lo tangible",
    I: "analítico y curioso",
    A: "creativo y expresivo",
    S: "empático y colaborador",
    E: "sociable y con liderazgo",
    C: "organizado y estructurado",
  };

  const riasecColorMap: Record<RiasecKey, string> = {
    R: accents.yellow,
    I: accents.blueish,
    A: accents.pink,
    S: accents.lavender,
    E: accents.blue,
    C: "#80CFA9", // soft green
  };

  const pills: TraitPillItem[] = [];

  top2.forEach((code: RiasecKey) => {
    const label = riasecLabels[code];
    const subtitle = riasecDesc[code];
    pills.push({
      id: `riasec-${code}`,
      title: label,
      subtitle,
      icon: "lightbulb.fill",
      accentColor: riasecColorMap[code],
      detail: `Interés ${label} (${subtitle}).`,
    });
  });

  // BFI dominant trait
  const bfiOrder = (Object.entries(bfi) as [BfiKey, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const dominant: BfiKey = bfiOrder[0][0];
  const bfiLabels: Record<BfiKey, string> = {
    O: "Apertura",
    C: "Responsabilidad",
    E: "Extraversión",
    A: "Amabilidad",
    N: "Estabilidad emocional",
  };
  const bfiLevel = (v: number) => (v > 5 ? "alta" : v > 3 ? "media" : "baja");
  const bfiText = interpretBFI(bfi);
  pills.push({
    id: `bfi-${dominant}`,
    title: `${bfiLabels[dominant]} ${bfiLevel(bfi[dominant])}`,
    subtitle: "BFI",
    icon: "person.fill",
    accentColor: accents.blueish,
    detail: bfiText,
  });

  // GRIT
  const getLevel = (v: number) => (v > 4 ? "alta" : v > 2 ? "media" : "baja");
  const gritText = interpretGrit(grit);
  pills.push({
    id: "grit",
    title: `Grit ${getLevel(grit.grits_overall)}`,
    subtitle: `Perseverancia ${getLevel(grit.perseverance)}, consistencia ${getLevel(grit.consistency)}`,
    icon: "bolt.fill",
    accentColor: accents.yellow,
    detail: gritText,
  });

  // PIAAC / PAA cognitive
  const cognitiveText = interpretCognitive({ piaac, paa });
  pills.push({
    id: "cognitive",
    title: "Habilidades cognitivas",
    subtitle: cognitiveText,
    icon: "chart.bar.fill",
    accentColor: accents.lavender,
    detail: cognitiveText,
  });

  return pills;
}

function interpretBFI(bfi: TraitScores["bfi"]) {
  const labels: Record<BfiKey, string> = {
    O: "Apertura",
    C: "Responsabilidad",
    E: "Extraversión",
    A: "Amabilidad",
    N: "Estabilidad emocional",
  };
  const getLevel = (v: number) => (v > 5 ? "alta" : v > 3 ? "media" : "baja");
  const parts = (Object.entries(bfi) as [BfiKey, number][]).map(
    ([k, v]) => `${labels[k]} ${getLevel(v)}`
  );
  return `Tu perfil muestra ${parts.join(", ")}.`;
}

function interpretGrit(grit: TraitScores["grit"]) {
  const getLevel = (v: number) => (v > 4 ? "alta" : v > 2 ? "media" : "baja");
  return `Tienes ${getLevel(grit.perseverance)} perseverancia y ${getLevel(grit.consistency)} consistencia, reflejando ${grit.grits_overall > 3 ? "una mentalidad enfocada en el esfuerzo constante" : "una oportunidad para fortalecer tu constancia"}.`;
}

function interpretCognitive({
  piaac,
  paa,
}: {
  piaac: TraitScores["piaac"];
  paa: TraitScores["paa"];
}) {
  const getBand = (v: number) =>
    v < 0.3 ? "nivel inicial" : v < 0.7 ? "nivel intermedio" : "nivel avanzado";
  return `Lectura: ${getBand(piaac.lit)}, Matemática: ${getBand(piaac.num)}, Resolución de problemas: ${getBand(piaac.ps)}.`;
}

function buildGeneralSummary(top2: RiasecKey[], bfi: TraitScores["bfi"]) {
  const bfiDominant = (Object.entries(bfi) as [BfiKey, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  const adjectives: Record<BfiKey, string> = {
    O: "curioso y analítico",
    C: "disciplinado y constante",
    E: "sociable y enérgico",
    A: "amable y empático",
    N: "reflexivo y sensible",
  };
  return `Tienes un perfil ${adjectives[bfiDominant]}, con intereses ${top2.map((t: RiasecKey) => (t === "A" ? "creativos" : t === "I" ? "investigativos" : "variados")).join(" y ")}.`;
}
