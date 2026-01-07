// hooks/useExpoRouterScreenTracking.tsx
import { useGlobalSearchParams, usePathname, useSegments } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";

/**
 * Tracks screen (route) changes for Expo Router by calling posthog.screen(name, props).
 *
 * - uses usePathname() as the canonical "screen name"
 * - dedupes calls by storing the last tracked pathname in a ref
 * - includes URL params as properties (optional)
 */
export default function useExpoRouterScreenTracking(opts?: {
  mapPathnameToFriendlyName?: (path: string) => string;
  includeParams?: boolean;
}) {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useGlobalSearchParams();
  const posthog = usePostHog();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || typeof posthog.screen !== "function") return;

    const rawPath = pathname ?? "/";
    // friendly name mapping hook option
    const friendly = opts?.mapPathnameToFriendlyName
      ? opts.mapPathnameToFriendlyName(rawPath)
      : // default: use pathname, or join segments for clarity
        rawPath !== "/"
        ? rawPath
        : "/";

    // prevent duplicate tracking
    if (lastPathRef.current === friendly) return;

    const properties: Record<string, any> = {
      pathname: rawPath,
      segments: segments?.join("/") ?? undefined,
    };

    if (opts?.includeParams) {
      // avoid circular refs; shallow copy and stringify complex objects
      properties.params = JSON.parse(JSON.stringify(params ?? {}));
    }

    try {
      posthog.screen(friendly, properties);
      lastPathRef.current = friendly;
    } catch (err) {
      // fail silently in production analytics path
      // optionally console.debug(err)
    }
    // stringify params to avoid unnecessary re-runs caused by object identity changes
  }, [pathname, segments?.join("/"), JSON.stringify(params ?? {}), posthog]);
}
