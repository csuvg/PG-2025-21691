// import { QUESTIONS } from "@/data/questions.const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Note: Questions are now fetched dynamically from the API

export type Option = {
  id: string;
  label: string;
  value?: number;
};

type QuestionType =
  | "radio"
  | "scale"
  | "multi"
  | "number"
  | "text"
  | "boolean"
  | "compound"
  | "matrix"
  | "time";

export type Question = {
  id: string;
  section: string;
  prompt: string;
  type: QuestionType;
  reverse?: boolean;
  meta?: Record<string, any>;
  options: Option[];
};

export type AnswerValue =
  | Option["id"]
  | string
  | number
  | Record<string, string | number>;
export type MultiAnswerValue = AnswerValue[];
export type Answers = Record<Question["id"], AnswerValue | MultiAnswerValue>;
export type QuestionTiming = Record<Question["id"], number>; // timestamp when question was first viewed

type QuizState = {
  step: number;
  questions: Question[];
  answers: Answers;
  questionStartTimes: QuestionTiming;
  quizSessionId?: string;
  quizStartedAt?: number;
  deviceSessionId?: string;
  shownSectionIntros: Record<string, boolean>;
  // Derived getter - currentQuestion is computed from step and questions
  getCurrentQuestion: () => Question | null;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: Question["id"], value: AnswerValue) => void;
  toggleMulti: (questionId: Question["id"], option: string) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  startQuestionTimer: (questionId: Question["id"]) => void;
  clearQuestionTimer: (questionId: Question["id"]) => void;
  markQuestionViewed: (questionId: Question["id"]) => void;
  markSectionIntroSeen: (sectionId: string) => void;
  beginSession: () => string;
  endSession: () => void;
  getSessionInfo: () => { quizSessionId?: string; quizStartedAt?: number };
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      step: 0,
      questions: [],
      answers: {},
      questionStartTimes: {},
      quizSessionId: undefined,
      quizStartedAt: undefined,
      shownSectionIntros: {},
      getCurrentQuestion: () => {
        const state = get();
        if (state.step === 0) return null; // Pre-quiz screen
        const questionIndex = state.step - 1; // step 1 = questions[0]
        return state.questions[questionIndex] || null;
      },
      setQuestions: (questions: Question[]) => set({ questions }),
      setAnswer: (questionId: Question["id"], value: AnswerValue) =>
        set(s => ({ answers: { ...s.answers, [questionId]: value } })),
      toggleMulti: (questionId: Question["id"], option: string) =>
        set(s => {
          const prev =
            (s.answers[questionId] as MultiAnswerValue | undefined) ?? [];
          const next = prev.includes(option as AnswerValue)
            ? prev.filter(o => o !== option)
            : [...prev, option as AnswerValue];
          return { answers: { ...s.answers, [questionId]: next } };
        }),

      next: () =>
        set(s => {
          const maxStep = s.questions.length; // step 0 = pre, 1..N = questions
          const nextStep = Math.min(maxStep, s.step + 1);
          const questionIndex = Math.max(nextStep - 1, 0);
          const nextQuestion = s.questions[questionIndex];

          // Start timer for the next question if it has a time limit and hasn't been started yet
          const updatedStartTimes = { ...s.questionStartTimes };
          if (
            nextQuestion?.meta?.timeLimitInSeconds &&
            !updatedStartTimes[nextQuestion.id]
          ) {
            updatedStartTimes[nextQuestion.id] = Date.now();
          }

          return {
            step: nextStep,
            questionStartTimes: updatedStartTimes,
          };
        }),
      prev: () =>
        set(s => {
          const prevStep = Math.max(0, s.step - 1);
          return { step: prevStep };
        }),
      reset: () =>
        set(s => ({
          step: 0,
          answers: {},
          questionStartTimes: {},
          shownSectionIntros: {},
          // Preserve questions so they don't need to be refetched
          questions: s.questions,
        })),
      startQuestionTimer: (questionId: Question["id"]) =>
        set(s => ({
          questionStartTimes: {
            ...s.questionStartTimes,
            [questionId]: Date.now(),
          },
        })),
      clearQuestionTimer: (questionId: Question["id"]) =>
        set(s => {
          const { [questionId]: _removed, ...rest } = s.questionStartTimes;
          return { questionStartTimes: rest };
        }),
      markQuestionViewed: (questionId: Question["id"]) =>
        set(s => {
          if (s.questionStartTimes[questionId]) return {} as any;
          return {
            questionStartTimes: {
              ...s.questionStartTimes,
              [questionId]: Date.now(),
            },
          };
        }),
      markSectionIntroSeen: (sectionId: string) =>
        set(s => ({
          shownSectionIntros: { ...s.shownSectionIntros, [sectionId]: true },
        })),
      beginSession: () => {
        const newId = `qs_${Date.now().toString(36)}${Math.random()
          .toString(36)
          .slice(2, 8)}`;
        set({
          quizSessionId: newId,
          quizStartedAt: Date.now(),
          answers: {},
          questionStartTimes: {},
          shownSectionIntros: {},
          step: 0,
        });
        return newId;
      },
      endSession: () =>
        set({ quizSessionId: undefined, quizStartedAt: undefined }),
      getSessionInfo: () => {
        const { quizSessionId, quizStartedAt } = get();
        return { quizSessionId, quizStartedAt };
      },
    }),
    {
      name: "mirai.quiz",
      storage: createJSONStorage(() => AsyncStorage),
      version: 3, // Bump version since we're changing the storage structure
      partialize: s => ({
        step: s.step,
        questions: s.questions,
        answers: s.answers,
        questionStartTimes: s.questionStartTimes,
        quizSessionId: s.quizSessionId,
        quizStartedAt: s.quizStartedAt,
        shownSectionIntros: s.shownSectionIntros,
        // Don't persist currentQuestion - it's derived from step
      }),
    }
  )
);
