import { useFocusEffect } from "@react-navigation/native";
import { usePostHog } from "posthog-react-native";
import { useCallback, useRef } from "react";

export function useScreenTimer(
  screen: string,
  props?: Record<string, unknown>,
  eventName: string = "time_on_screen"
) {
  const posthog = usePostHog();
  const start = useRef<number | null>(null);
  const propsRef = useRef<Record<string, unknown> | undefined>(undefined);
  propsRef.current = props;

  useFocusEffect(
    useCallback(() => {
      start.current = Date.now();

      return () => {
        if (start.current) {
          const durationSec = (Date.now() - start.current) / 1000;
          const p = propsRef.current;
          posthog.capture(
            eventName,
            p && typeof p === "object"
              ? { screen, durationSec, ...p }
              : { screen, durationSec }
          );
          start.current = null;
        }
      };
    }, [screen, posthog, eventName])
  );
}
