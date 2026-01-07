import { useChatStore } from "@/stores/chat";
import { useExploreStore } from "@/stores/explore";
import { useOnboardingStore } from "@/stores/onboarding";
import { useQuizStore } from "@/stores/quiz";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";

/**
 * Storage keys used by persisted Zustand stores
 */
const STORAGE_KEYS = [
  "mirai.quiz",
  "chat-store",
  "mirai.explore",
  "mirai.onboarding",
] as const;

/**
 * Comprehensive cleanup function for sign out and account deletion.
 * Resets all stores, clears AsyncStorage, and clears React Query cache.
 */
export async function cleanupAuthData(queryClient: QueryClient): Promise<void> {
  try {
    // Reset all Zustand stores
    const quizStore = useQuizStore.getState();
    const chatStore = useChatStore.getState();
    const exploreStore = useExploreStore.getState();
    const onboardingStore = useOnboardingStore.getState();

    // Reset stores
    quizStore.reset();
    quizStore.endSession();
    chatStore.clearAll();
    exploreStore.clear();
    onboardingStore.reset(); // Reset onboarding state (seen flags for all screens)

    // Clear AsyncStorage for all persisted stores
    await AsyncStorage.multiRemove(STORAGE_KEYS);

    // Clear React Query cache
    queryClient.clear();
  } catch (error) {
    console.error("Error during auth cleanup:", error);
    // Don't throw - we still want to proceed with sign out even if cleanup fails
  }
}

/**
 * Cleanup function for quiz repetition.
 * Resets quiz store, clears AsyncStorage for quiz, and clears quiz-related React Query cache.
 */
export async function cleanupQuizData(queryClient: QueryClient): Promise<void> {
  try {
    // Reset quiz store
    const quizStore = useQuizStore.getState();
    quizStore.reset();
    quizStore.endSession();

    // Clear AsyncStorage for quiz store
    await AsyncStorage.removeItem("mirai.quiz");

    // Clear React Query cache for quiz-related queries
    queryClient.clear();
  } catch (error) {
    console.error("Error during quiz cleanup:", error);
    // Don't throw - we still want to proceed even if cleanup fails
  }
}
