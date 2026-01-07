import { type ExploreCardItem } from "@/data/explore.const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ExploreState = {
  selected?: ExploreCardItem;
  setSelected: (card?: ExploreCardItem) => void;
  clear: () => void;
};

export const useExploreStore = create<ExploreState>()(
  persist(
    set => ({
      selected: undefined,
      setSelected: (card?: ExploreCardItem) => set({ selected: card }),
      clear: () => set({ selected: undefined }),
    }),
    {
      name: "mirai.explore",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: s => ({ selected: s.selected }),
    }
  )
);
