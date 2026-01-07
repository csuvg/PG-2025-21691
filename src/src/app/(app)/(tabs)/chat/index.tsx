import { useOnboardingStore } from "@/stores/onboarding";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { toChatHistory, useGenerateMessage } from "@/api/chat";
import ChatInput from "@/components/chat/chat-input";
import ChatMessageList from "@/components/chat/chat-message-list";
import { ConversationsSheet } from "@/components/chat/conversations-sheet";
import type { Message } from "@/components/chat/types";
import IntroModal from "@/components/ui/intro-modal";
import { ONBOARDING_INTROS } from "@/data/onboarding.const";
import { useAnalytics } from "@/hooks/use-analytics";
import { useChatStore } from "@/stores/chat";
import { inferTopic } from "@/utils/topic-inference";
import type { TrueSheet as TrueSheetType } from "@lodev09/react-native-true-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Icon } from "@roninoss/icons";
import { Stack, useLocalSearchParams } from "expo-router";

// Response shape: { question, answer, sources? }

// Debug flag for performance profiling - creates an unrealistically long conversation
const DEBUG_PERFORMANCE = false;

export default function ChatScreen() {
  const { theme } = useUnistyles();
  const { chatPrompt } = useAnalytics();
  const { initialPrompt } = useLocalSearchParams<{ initialPrompt?: string }>();
  const { seen, markSeen } = useOnboardingStore();
  const conversations = useChatStore(state => state.conversations);
  const currentId = useChatStore(state => state.currentId);
  const createConversation = useChatStore(state => state.createConversation);
  const addMessage = useChatStore(state => state.addMessage);
  const setCurrent = useChatStore(state => state.setCurrent);
  const deleteConversation = useChatStore(state => state.deleteConversation);
  const clear = useChatStore(state => state.clearAll);
  const [hydrated, setHydrated] = useState(
    (useChatStore as any).persist?.hasHydrated?.() ?? false
  );
  const [showIntro, setShowIntro] = useState(false);
  const [input, setInput] = useState("");
  const bottomTabBarHeight = useBottomTabBarHeight();
  const [isSending, setIsSending] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const { mutateAsync: generate } = useGenerateMessage();

  const listRef = useRef<FlatList<Message>>(null);
  const sheetRef = useRef<TrueSheetType>(null);
  const hasPreloadedInputRef = useRef(false);
  const debugInitializedRef = useRef(false);

  const activeMessages: Message[] = (() => {
    if (!currentId) return [];
    const conv = conversations[currentId];
    if (!conv) return [];
    return conv.messages.map(m => ({
      id: m.id,
      role: m.role === "model" ? "assistant" : "user",
      content: m.content,
    }));
  })();

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending && !isResponding,
    [input, isSending, isResponding]
  );

  // Scroll to bottom (offset 0 in inverted list)
  const scrollToBottom = (animated = true) => {
    // Use requestAnimationFrame to ensure FlatList has rendered
    requestAnimationFrame(() => {
      setTimeout(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated });
      }, 100);
    });
  };

  useEffect(() => {
    // Auto-scroll to bottom on new messages or conversation change
    if (activeMessages.length > 0) {
      scrollToBottom(true);
    }
  }, [activeMessages.length, currentId]);

  useEffect(() => {
    if (!seen.chat) setShowIntro(true);
  }, [seen.chat]);

  // Track store hydration to avoid wiping optimistic updates
  useEffect(() => {
    const persistApi = (useChatStore as any).persist;
    if (persistApi?.hasHydrated?.()) {
      setHydrated(true);
      return;
    }
    const unsub = persistApi?.onFinishHydration?.(() => setHydrated(true));
    return () => unsub?.();
  }, []);

  // Prefill input from route params (one-time)
  useEffect(() => {
    const value = Array.isArray(initialPrompt)
      ? initialPrompt[0]
      : initialPrompt;
    if (!hasPreloadedInputRef.current && typeof value === "string" && value) {
      setInput(value);
      hasPreloadedInputRef.current = true;
    }
  }, [initialPrompt]);

  // Debug: Load unrealistically long conversation for performance profiling
  useEffect(() => {
    if (!DEBUG_PERFORMANCE || !hydrated || debugInitializedRef.current) return;

    // Find existing debug conversation or create new one
    const existingDebugConv = Object.values(conversations).find(
      conv => conv.title === "Debug Performance Test"
    );

    if (existingDebugConv && existingDebugConv.messages.length >= 200) {
      // Use existing debug conversation
      setCurrent(existingDebugConv.id);
      debugInitializedRef.current = true;
      return;
    }

    // Create new debug conversation with many messages
    const debugConvId = createConversation("Debug Performance Test");
    setCurrent(debugConvId);
    debugInitializedRef.current = true;

    // Generate 250 messages with realistic content
    const sampleQuestions = [
      "¿Qué carreras están en demanda actualmente?",
      "¿Cuál es la diferencia entre ingeniería de software e ingeniería informática?",
      "¿Qué habilidades necesito para ser un buen desarrollador?",
      "¿Cuánto tiempo toma aprender programación?",
      "¿Qué lenguajes de programación debería aprender primero?",
      "¿Es necesario tener un título universitario para trabajar en tecnología?",
      "¿Qué es mejor: trabajar para una empresa o ser freelance?",
      "¿Cómo puedo mejorar mi portafolio de proyectos?",
      "¿Qué certificaciones son valiosas en tecnología?",
      "¿Cuál es el salario promedio de un desarrollador junior?",
    ];

    const sampleAnswers = [
      "Las carreras en tecnología están muy en demanda, especialmente desarrollo de software, ciencia de datos, y ciberseguridad. El mercado laboral está creciendo rápidamente y hay muchas oportunidades para profesionales cualificados.",
      "La ingeniería de software se enfoca más en el desarrollo de aplicaciones y sistemas, mientras que la ingeniería informática tiene un enfoque más amplio que incluye hardware, redes y sistemas embebidos. Ambas son excelentes opciones dependiendo de tus intereses.",
      "Para ser un buen desarrollador necesitas habilidades técnicas como programación, resolución de problemas, y conocimiento de frameworks modernos. También son importantes las habilidades blandas como comunicación, trabajo en equipo, y capacidad de aprendizaje continuo.",
      "El tiempo para aprender programación varía según el individuo y el nivel de dedicación. Con práctica diaria, puedes adquirir habilidades básicas en 3-6 meses, pero dominar el desarrollo profesional puede tomar 1-2 años o más.",
      "Para comenzar, te recomiendo Python por su sintaxis simple, JavaScript para desarrollo web, o Java para aplicaciones empresariales. La elección depende de tus objetivos profesionales específicos.",
    ];

    // Generate messages (alternating user/model) - batch them to avoid too many re-renders
    for (let i = 0; i < 500; i++) {
      const isUser = i % 2 === 0;
      const content = isUser
        ? sampleQuestions[i % sampleQuestions.length] + ` (mensaje ${i + 1})`
        : sampleAnswers[i % sampleAnswers.length] +
          ` Esta es una respuesta más larga para simular contenido realista. Incluye información detallada sobre el tema, consideraciones adicionales, y recomendaciones prácticas. Mensaje número ${i + 1} de la conversación de prueba de rendimiento.`;

      addMessage(debugConvId, isUser ? "user" : "model", content);
    }
  }, [
    DEBUG_PERFORMANCE,
    hydrated,
    conversations,
    createConversation,
    setCurrent,
    addMessage,
  ]);

  // Ensure there is an active conversation; create with a friendly greeting if none
  useEffect(() => {
    if (!hydrated) return;
    if (DEBUG_PERFORMANCE) return; // Skip normal flow when debugging
    if (!currentId) {
      const title = "Nuevo chat";
      const id = createConversation(title);
      setCurrent(id);
      addMessage(
        id,
        "model",
        "¡Hola! Soy tu guía de carreras. Pregúntame sobre carreras, habilidades o rutas de aprendizaje."
      );
    }
  }, [
    hydrated,
    currentId,
    createConversation,
    setCurrent,
    addMessage,
    DEBUG_PERFORMANCE,
  ]);

  function ensureConversation(titleFallback: string): string {
    if (currentId && conversations[currentId]) return currentId;
    const id = createConversation(titleFallback);
    setCurrent(id);
    return id;
  }

  function handleSend() {
    const text = input.trim();
    if (!hydrated || !text || isSending || isResponding) return;

    chatPrompt(text.length, inferTopic(text));

    setIsSending(true);
    setInput("");
    const convId = ensureConversation(text.slice(0, 50));
    addMessage(convId, "user", text);
    setIsSending(false);
    setIsResponding(true);

    // Read latest state after adding message to ensure it's included in history
    const state = (useChatStore as any).getState?.() ?? { conversations };
    const conv = state.conversations?.[convId];
    // Build history from prior messages only (exclude this just-sent question)
    // Limit to last 20 messages for context window management
    const MAX_HISTORY_MESSAGES = 20;
    let priorMessages: Array<{ role: "user" | "model"; content: string }> = [];
    if (conv?.messages?.length) {
      priorMessages = conv.messages.slice();
      const last = priorMessages[priorMessages.length - 1];
      if (last && last.role === "user" && last.content === text) {
        priorMessages = priorMessages.slice(0, -1);
      }
      // Keep only the last MAX_HISTORY_MESSAGES
      if (priorMessages.length > MAX_HISTORY_MESSAGES) {
        priorMessages = priorMessages.slice(-MAX_HISTORY_MESSAGES);
      }
    }
    const historyInput = priorMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    generate({
      question: text,
      history: toChatHistory(historyInput),
    })
      .then(response => {
        if (response?.answer) addMessage(convId, "model", response.answer);
      })
      .catch(e => {
        addMessage(
          convId,
          "model",
          "Lo siento, no pude procesarlo ahora mismo. Inténtalo de nuevo."
        );
      })
      .finally(() => {
        setIsResponding(false);
      });
  }

  function openConversationsSheet() {
    sheetRef.current?.present();
  }

  function handleSelectConversation(id: string) {
    setCurrent(id);
    sheetRef.current?.dismiss();
  }

  function handleNewConversation() {
    console.log("handleNewConversation");
    const id = createConversation("Nuevo chat");
    setCurrent(id);
    addMessage(
      id,
      "model",
      "¡Hola! Soy tu guía de carreras. Pregúntame sobre carreras, habilidades o rutas de aprendizaje."
    );
    sheetRef.current?.dismiss();
  }

  function handleDeleteConversation(id: string) {
    const wasCurrent = currentId === id;
    deleteConversation(id);
    if (wasCurrent) {
      const state = (useChatStore as any).getState?.();
      const remaining = state?.conversations ?? {};
      const nextId = Object.keys(remaining)[0] ?? null;
      if (nextId) {
        setCurrent(nextId);
      } else {
        const newId = createConversation("Nuevo chat");
        setCurrent(newId);
        addMessage(
          newId,
          "model",
          "¡Hola! Soy tu guía de carreras. Pregúntame sobre carreras, habilidades o rutas de aprendizaje."
        );
      }
    }
  }

  return (
    <>
      <IntroModal
        visible={showIntro}
        title={ONBOARDING_INTROS.chat.title}
        body={ONBOARDING_INTROS.chat.body}
        onClose={() => {
          markSeen("chat");
          setShowIntro(false);
        }}
      />
      <Stack.Screen
        options={{
          headerTitle: "Chat",
          headerRight: () => (
            <Pressable onPress={openConversationsSheet}>
              <Icon
                name="square.and.pencil"
                size={24}
                color={theme.colors.textSecondary}
                namingScheme="sfSymbol"
              />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? bottomTabBarHeight : 20}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            marginBottom: Platform.OS === "ios" ? bottomTabBarHeight : 0,
            paddingBottom: Platform.OS === "android" ? bottomTabBarHeight : 0,
          },
        ]}
      >
        <ChatMessageList
          messages={activeMessages}
          isResponding={isResponding}
          bottomTabBarHeight={bottomTabBarHeight}
          onClear={clear}
          listRef={listRef}
        />

        <ChatInput
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          canSend={canSend}
        />
      </KeyboardAvoidingView>

      <ConversationsSheet
        ref={sheetRef}
        conversations={conversations}
        currentId={currentId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
    </>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
}));
