import { useQuery } from "@tanstack/react-query";
import { api } from "../client";

// Types
export interface Career {
  _id: string;
  name: string;
  faculty: string;
  description: string;
  duration: number;
  employability: string;
}

export interface Course {
  id: string;
  name: string;
  prerequisites?: string[];
}

export interface Semester {
  [key: string]: Course[];
}

export interface StudyYear {
  primer_semestre: Course[];
  segundo_semestre: Course[];
}

export interface StudyPlan {
  año_1: StudyYear;
  año_2: StudyYear;
  año_3: StudyYear;
  año_4: StudyYear;
  año_5: StudyYear;
}

export interface DevelopmentArea {
  _id: string;
  area: string;
  descripcion: string;
}

export interface TrainingArea {
  _id: string;
  area: string;
  descripcion: string;
}

export interface CareerTag {
  _id: string;
  tag: string;
  name: string;
  score: number;
}

export interface PensumCourse {
  _id: string;
  nombre: string;
  prerequisitos: PensumCourse[] | string[];
}

export interface PensumSemester {
  first_semester: PensumCourse[];
  second_semester: PensumCourse[];
}

export interface PensumYear {
  year: number;
  first_semester: PensumCourse[];
  second_semester: PensumCourse[];
}

export type Pensum = PensumYear[];

export interface CourseItem {
  _id: string;
  nombre: string;
}

export interface DetailedCareer {
  _id: string;
  nombre_carrera: string;
  facultad: string;
  descripcion: string;
  duracion: number;
  empleabilidad: string;
  plan_de_estudio: StudyPlan;
  areas_de_desarrollo_potencial: DevelopmentArea[];
  areas_de_formacion: TrainingArea[];
  perfil_del_egresado: string;
  competencias_desarrolladas: any[];
  salario_minimo: number;
  salario_maximo: number;
  moneda_salario: string;
  tags: CareerTag[];
  image_url: string;
  pensum?: Pensum;
  courses?: CourseItem[];
}

interface CareersResponse {
  careers: Career[];
}

interface CareerResponse {
  career: DetailedCareer;
  pensum?: Pensum;
  courses?: CourseItem[];
}

export interface SimilarCareer {
  _id: string;
  name: string;
  description: string;
  duration: number;
  employability: string;
  faculty: string;
  image_url: string;
  similarity_score: number;
}

interface SimilarCareersResponse {
  similar_career: SimilarCareer[];
}

interface WhatIfQuestionResponse {
  shortQuestion: string;
  completeQuestion: string;
  newCareerId: string;
}

interface WhatIfContentResponse {
  mini_inform: string;
}

// Query keys
const CAREERS_QUERY_KEY = "careers";
const CAREER_QUERY_KEY = "career";
const SIMILAR_CAREERS_QUERY_KEY = "similar";
const WHAT_IF_QUESTION_QUERY_KEY = "what-if";
const RESULTS_QUERY_KEY = "results";

// API functions
async function getCareers(): Promise<Career[]> {
  const response = await api.get<CareersResponse>("/careers");
  return response.data.careers;
}

async function getCareer(id: string): Promise<DetailedCareer> {
  const response = await api.get<CareerResponse>(`/careers/${id}`);
  // console.log("Pensum", JSON.stringify(response.data.pensum, null, 2));
  console.log("Courses", JSON.stringify(response.data.courses, null, 2));

  // Merge pensum and courses from response into career object if they exist
  return {
    ...response.data.career,
    ...(response.data.pensum && { pensum: response.data.pensum }),
    ...(response.data.courses && { courses: response.data.courses }),
  };
}

async function getSimilarCareers(id: string): Promise<SimilarCareersResponse> {
  const response = await api.post<SimilarCareersResponse>(
    `recommendations/career/similar/${id}`
  );
  return response.data;
}

async function generateWhatIfQuestion(careerId: string) {
  const response = await api.post<WhatIfQuestionResponse>(
    `recommendations/generate/career-combination/${careerId}`
  );
  return response.data;
}

async function generateWhatIfContent(question: string) {
  const makeRequest = async () => {
    const response = await api.post<WhatIfContentResponse>(
      `recommendations/generate/mini-inform`,
      {
        question,
      }
    );
    return response.data;
  };

  let result = await makeRequest();

  // Check if response is null, empty, or mini_inform is missing/empty
  if (!result || !result.mini_inform || result.mini_inform.trim() === "") {
    result = await makeRequest();
  }

  return result;
}

// Define types for trait scores
interface PIAACTraits {
  lit: number; // Lectura/Literacy
  num: number;
  ps: number; // Problem solving
}

interface PAACTraits {
  read: number;
  en: number;
  num: number;
}

interface RiasecTraits {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

interface BFITraits {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

interface GritTraits {
  perseverance: number;
  consistency: number;
  grits_overall: number;
}

export interface TraitScores {
  piaac: PIAACTraits;
  paa: PAACTraits;
  riasec: RiasecTraits;
  bfi: BFITraits;
  grit: GritTraits;
}

// Career recommendation interfaces
export interface RecommendedCareer {
  career_id: string;
  name: string;
  image_url: string;
  description: string;
  duration: number;
  employability: string;
  faculty: string;
}

export interface EnhancedExplanation {
  positive_summary: string;
  concerns_summary: string;
  personalized_advice: string;
}

export interface CareerRecommendation {
  career: RecommendedCareer;
  score: number;
  compatibility_pct: number;
  why_pos: string;
  why_neg: string;
  enhanced_explanation: EnhancedExplanation;
}

// Result object interface
export interface CareerResults {
  _id: string;
  user_id: string;
  scores_updated_at: string;
  trait_scores: TraitScores;
  quiz_completed_at: string;
  recommendations: CareerRecommendation[];
}

export interface ResultsResponse {
  results: CareerResults;
}

async function getResults(): Promise<ResultsResponse> {
  const response = await api.get<ResultsResponse>("/quiz/results");
  return response.data;
}

export function useResults() {
  return useQuery({
    queryKey: [RESULTS_QUERY_KEY],
    queryFn: () => getResults(),
  });
}

// Custom hooks
export function useCareers() {
  return useQuery({
    queryKey: [CAREERS_QUERY_KEY],
    queryFn: () => getCareers(),
  });
}

export function useCareer(id: string, initialData?: any) {
  return useQuery({
    queryKey: [CAREER_QUERY_KEY, id],
    queryFn: () => getCareer(id),
    enabled: !!id, // Only fetch when id is provided
    retry: false,
    initialData: initialData,
  });
}

export function useSimilarCareers(id: string) {
  return useQuery({
    queryKey: [SIMILAR_CAREERS_QUERY_KEY, id],
    queryFn: () => getSimilarCareers(id),
    enabled: !!id, // Only fetch when id is provided
    retry: false,
  });
}

export function useGenerateWhatIfQuestion(careerId: string) {
  return useQuery({
    queryKey: [WHAT_IF_QUESTION_QUERY_KEY, careerId],
    queryFn: () => generateWhatIfQuestion(careerId),
    enabled: !!careerId,
    retry: false,
  });
}

export function useGenerateWhatIfContent(question: string) {
  return useQuery({
    queryKey: [WHAT_IF_QUESTION_QUERY_KEY, question],
    queryFn: () => generateWhatIfContent(question),
    enabled: !!question && question.trim().length > 0,
    staleTime: Infinity,
    refetchOnMount: false,
    retry: true,
  });
}
