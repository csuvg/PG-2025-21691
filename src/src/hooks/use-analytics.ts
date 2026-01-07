import { usePostHog } from "posthog-react-native";

/*
Quiz analytics events (minimal properties for quick identification)
- quiz_session_started: { quizSessionId, totalQuestions }
- quiz_question_viewed: { quizSessionId?, questionId, type }
- quiz_question_answered: { quizSessionId?, questionId, type, durationSec? }
- quiz_navigate: { quizSessionId?, direction }
- quiz_finished: { quizSessionId?, totalDurationSec? }
- quiz_results_continue: { quizSessionId? }

Note: quizSessionId format is "qs_" + timestamp(base36) + random(6 chars base36)
Example: "qs_m8k3p2a1bc"
*/

export function useAnalytics() {
  const posthog = usePostHog();

  function cleanProps<T extends Record<string, any>>(props: T) {
    const out: Record<string, any> = {};
    for (const key of Object.keys(props)) {
      const value = (props as any)[key];
      if (value !== undefined) out[key] = value;
    }
    return out;
  }

  return {
    authSuccess: (method: string) =>
      posthog.capture("auth_success", { method }),
    // Legacy/simple quiz events kept for backward compatibility
    quizStarted: () => posthog.capture("quiz_started"),
    quizCompleted: (completedAt: Date) =>
      posthog.capture("quiz_completed", {
        completedAt: completedAt.toISOString(),
      }),
    quizResultsDeleted: () => posthog.capture("quiz_results_deleted"),
    careerViewed: (careerId: string, careerName: string) =>
      posthog.capture("career_viewed", { careerId, careerName }),
    cardSwipe: (direction: "left" | "right", cardType: string) =>
      posthog.capture("card_swipe", { direction, cardType }),
    cardSaved: (cardType: string, cardId: string) =>
      posthog.capture("card_saved", { cardType, cardId }),
    careerSaved: (
      careerId: string,
      careerName: string,
      tags?: Array<{ id?: string; name: string }>
    ) =>
      posthog.capture(
        "career_saved",
        cleanProps({
          careerId,
          careerName,
          tags: tags?.map(t => (t?.name ? t.name : String(t)))?.slice(0, 10),
        })
      ),
    // removed: careerSearchSelected

    careerSearchQuery: (args: {
      query: string;
      resultsCount?: number;
      topCareerId?: string;
      topCareerName?: string;
    }) =>
      posthog.capture(
        "career_search_query",
        cleanProps({
          query: args.query,
          resultsCount: args.resultsCount,
          topCareerId: args.topCareerId,
          topCareerName: args.topCareerName,
        })
      ),
    chatInvoked: (entry: string) => posthog.capture("chat_invoked", { entry }),
    chatPrompt: (promptLength: number, topic: string) =>
      posthog.capture("chat_prompt_sent", { promptLength, topic }),
    profileOpened: () => posthog.capture("profile_opened"),

    // Quiz instrumentation (structured, minimal props)
    quizSessionStarted: (args: {
      quizSessionId: string;
      totalQuestions: number;
    }) =>
      posthog.capture("quiz_session_started", {
        quizSessionId: args.quizSessionId,
        totalQuestions: args.totalQuestions,
      }),
    quizQuestionViewed: (args: {
      quizSessionId?: string;
      questionId: string;
      type: string;
    }) =>
      posthog.capture(
        "quiz_question_viewed",
        cleanProps({
          quizSessionId: args.quizSessionId,
          questionId: args.questionId,
          type: args.type,
        })
      ),
    quizQuestionAnswered: (args: {
      quizSessionId?: string;
      questionId: string;
      type: string;
      durationSec?: number;
    }) =>
      posthog.capture(
        "quiz_question_answered",
        cleanProps({
          quizSessionId: args.quizSessionId,
          questionId: args.questionId,
          type: args.type,
          durationSec: args.durationSec,
        })
      ),
    quizNavigate: (
      direction: "next" | "prev",
      args: { quizSessionId?: string }
    ) =>
      posthog.capture(
        "quiz_navigate",
        cleanProps({
          quizSessionId: args.quizSessionId,
          direction,
        })
      ),
    quizFinished: (args: {
      quizSessionId?: string;
      totalDurationSec?: number;
    }) =>
      posthog.capture(
        "quiz_finished",
        cleanProps({
          quizSessionId: args.quizSessionId,
          totalDurationSec: args.totalDurationSec,
        })
      ),
    quizResultsContinue: (args: { quizSessionId?: string }) =>
      posthog.capture(
        "quiz_results_continue",
        cleanProps({ quizSessionId: args.quizSessionId })
      ),
  };
}
