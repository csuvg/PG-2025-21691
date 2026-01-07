import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatState = {
  conversations: Record<string, Conversation>;
  currentId: string | null;

  // actions
  createConversation: (title: string) => string;
  deleteConversation: (convId: string) => void;
  addMessage: (convId: string, role: "user" | "model", content: string) => void;
  setCurrent: (convId: string | null) => void;
  clearAll: () => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: {},
      currentId: null,

      // Simple sequential id generator to avoid crypto dependencies
      // Note: good enough for local storage and UI keys
      _nextId: 0 as number,
      _generateId(prefix: string) {
        const id = `${prefix}-${Date.now()}-${(++(get() as any)._nextId).toString(36)}`;
        return id;
      },

      createConversation: title => {
        const id = (get() as any)._generateId("conv");
        set(state => {
          state.conversations[id] = {
            id,
            title,
            messages: [],
          };
          state.currentId = id;
          return { conversations: state.conversations, currentId: id };
        });
        return id;
      },

      deleteConversation: convId => {
        set(state => {
          const convs = { ...state.conversations };
          delete convs[convId];
          return {
            conversations: convs,
            currentId: state.currentId === convId ? null : state.currentId,
          };
        });
      },

      addMessage: (convId, role, content) => {
        const msg: Message = {
          id: (get() as any)._generateId("msg"),
          role,
          content,
          timestamp: Date.now(),
        };
        set(state => {
          const conv = state.conversations[convId];
          if (!conv) {
            // optionally throw or ignore
            return state;
          }
          conv.messages.push(msg);
          // optional: trim older messages if you want max length
          // e.g. conv.messages = conv.messages.slice(-100);
          return {
            conversations: { ...state.conversations },
          };
        });
      },

      setCurrent: convId => {
        set(() => ({ currentId: convId }));
      },

      clearAll: () => {
        set(() => ({
          conversations: {},
          currentId: null,
        }));
        // optional: clearing persisted storage
      },
    }),
    {
      name: "chat-store", // the key in storage
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // optionally partialize so you only persist some parts:
      partialize: state => ({
        conversations: state.conversations,
        currentId: state.currentId,
      }),
      // optionally migrations if schema changes:
      migrate: (persistedState, version) => {
        // version-based migration logic
        return persistedState;
      },
    }
  )
);
