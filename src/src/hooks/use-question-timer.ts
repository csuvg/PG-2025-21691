import { useQuizStore } from "@/stores/quiz";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export function useQuestionTimer() {
  // Subscribe to all pieces that can affect the current timer:
  // - questionStartTimes: to get/update the start timestamp
  // - currentQuestionId and timeLimitInSeconds: to re-render when question changes
  const { questionStartTimes, currentQuestionId, timeLimitInSeconds } =
    useQuizStore(
      useShallow(state => {
        const cq = state.getCurrentQuestion();
        return {
          questionStartTimes: state.questionStartTimes,
          currentQuestionId: cq?.id,
          timeLimitInSeconds: cq?.meta?.timeLimitInSeconds as
            | number
            | undefined,
        };
      })
    );

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const questionStartTime = currentQuestionId
    ? questionStartTimes[currentQuestionId]
    : undefined;

  useEffect(() => {
    if (!timeLimitInSeconds || !questionStartTime) {
      setTimeRemaining(0);
      setIsTimeUp(false);
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      const remaining = Math.max(0, timeLimitInSeconds - elapsed);

      setTimeRemaining(remaining);
      setIsTimeUp(remaining === 0);
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timeLimitInSeconds, questionStartTime, currentQuestionId]);

  return {
    timeRemaining,
    isTimeUp,
    hasTimeLimit: !!timeLimitInSeconds,
  };
}
