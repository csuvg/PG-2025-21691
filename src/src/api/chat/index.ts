import { useMutation } from "@tanstack/react-query";
import { api } from "../client";

// Types matching the guide service expectations
export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: ChatMessagePart[];
}

export interface Conversation {
  question: string;
  history: ChatMessage[];
}

export interface AssistantSource {
  collection: string;
  title: string;
  section: string;
  relevanceScore?: number;
}

export interface AssistantResponse {
  question: string;
  answer: string;
  sources?: AssistantSource[];
}

const ASSISTANT_ASK_ROUTE = "/recommendations/guide/ask";

export function toChatHistory(
  messages: Array<{ role: "user" | "model"; content: string }>
): ChatMessage[] {
  return messages.map(message => ({
    role: message.role,
    parts: [{ text: message.content }],
  }));
}

export async function fetchResponse(
  payload: Conversation
): Promise<AssistantResponse> {
  const response = await api.post(ASSISTANT_ASK_ROUTE, payload);
  return response.data as AssistantResponse;
}

export function useGenerateMessage() {
  return useMutation({
    mutationFn: fetchResponse,
  });
}
