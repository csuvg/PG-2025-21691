import type { Answers, Question } from "@/stores/quiz";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../client";

export const QUESTIONS_QUERY_KEY = "quiz";
const BASE_ROUTE = "recommendations/initial-test";

async function getQuiz(): Promise<Question[]> {
  const response = await api.get(`${BASE_ROUTE}/items`);

  // Section order: Easy → Medium → Hard
  // Start with personality/interests, then basic skills, finish with timed/complex tasks
  const sectionOrder: Record<string, number> = {
    metadata: 1,
    bfi: 2,
    riasec: 3,
    grit: 4,
    paa_english: 5,
    paa_math: 6,
    piaac_numeric: 7,
    piaac_reading: 8,
    paa_redaccion: 9,
    piaac_problem: 10,
  };

  response.data.sort((a: Question, b: Question) => {
    const orderA = sectionOrder[a.section] ?? 999;
    const orderB = sectionOrder[b.section] ?? 999;
    return orderA - orderB;
  });

  return response.data;
}

export function useQuiz() {
  return useQuery({
    queryKey: [QUESTIONS_QUERY_KEY],
    queryFn: getQuiz,
    staleTime: Infinity,
  });
}

async function submitQuiz(answers: Answers) {
  const response = await api.post(`${BASE_ROUTE}/calculate`, answers);
  return response.data;
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: submitQuiz,
  });
}

async function deleteQuizResults(): Promise<void> {
  await api.delete("/quiz/results");
}

export function useDeleteQuizResults() {
  return useMutation({
    mutationFn: deleteQuizResults,
  });
}
