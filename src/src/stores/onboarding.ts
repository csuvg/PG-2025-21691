import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingScreenKey = "careers" | "explore" | "chat" | "profile";

type OnboardingState = {
  seen: Record<OnboardingScreenKey, boolean>;
  reset: () => void;
  markSeen: (key: OnboardingScreenKey) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      seen: {
        careers: false,
        explore: false,
        chat: false,
        profile: false,
      },
      reset: () =>
        set({
          seen: { careers: false, explore: false, chat: false, profile: false },
        }),
      markSeen: (key: OnboardingScreenKey) =>
        set(s => ({ seen: { ...s.seen, [key]: true } })),
    }),
    {
      name: "mirai.onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: s => ({ seen: s.seen }),
    }
  )
);
