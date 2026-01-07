import type { UserProfile, UserProfileLike } from "@/api/profile";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../client";

// Types
export interface FeedTag {
  id?: string;
  tag?: string;
  name: string;
  score?: number;
}

export interface CareerFeedItem {
  _id: string;
  type: "career";
  display_data: {
    name: string;
    description: string;
    tags: FeedTag[];
    image_url: string;
    faculty: string;
    employability: string;
    duration: string;
  };
  reference: {
    collection: string;
    id: string;
  };
  created_at: string;
  updated_at: string;
  matchingTagCount?: number;
}

export interface WhatIfFeedItem {
  type: "what_if";
  display_data: {
    question: [string, string, string]; // [careerId, shortQuestion, completeQuestion]
    tags: FeedTag[];
  };
  created_at: string;
  updated_at: string;
}

export interface TestimonyFeedItem {
  _id: string;
  type: "testimony";
  display_data: {
    egresado: string;
    experiencia: string;
    tags: FeedTag[];
    carrera?: {
      id: string;
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export type FeedItem = CareerFeedItem | WhatIfFeedItem | TestimonyFeedItem;

export interface FeedPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset: number;
}

export interface FeedRecommendations {
  nextBatchUrl: string;
}

interface FeedResponse {
  data: FeedItem[];
  pagination: FeedPagination;
  recommendations: FeedRecommendations;
}

// Query keys
const FEED_QUERY_KEY = "explore-feed";

// API functions
async function getFeed(
  offset: number = 0,
  limit: number = 8
): Promise<FeedResponse> {
  const response = await api.get<FeedResponse>("/explore/feed", {
    params: {
      offset,
      limit,
    },
  });
  console.log("<FEED RESPONSE>", JSON.stringify(response.data, null, 2));
  return response.data;
}

// Custom hooks
export function useFeed(offset: number = 0, limit: number = 8) {
  return useQuery({
    queryKey: [FEED_QUERY_KEY, offset, limit],
    queryFn: () => getFeed(offset, limit),
    retry: false,
  });
}

export function useExploreFeed(limit: number = 8) {
  return useInfiniteQuery({
    queryKey: [FEED_QUERY_KEY, "infinite", limit],
    queryFn: ({ pageParam = 0 }) => getFeed(pageParam as number, limit),
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.pagination?.hasMore ? lastPage.pagination.nextOffset : undefined,
    retry: false,
  });
}

interface LikeCardResponse {
  success: boolean;
  liked: boolean;
}

async function toggleLike(
  cardId: string,
  action: "like" | "unlike"
): Promise<LikeCardResponse> {
  const response = await api.patch<LikeCardResponse>(
    `/explore/cards/${cardId}/likes`,
    {
      action,
    }
  );
  return response.data;
}

/**
 * Hook to like or unlike an explore feed card.
 * Usage:
 *   const mutation = useToggleLike();
 *   mutation.mutate({ cardId, action });
 */
type ToggleLikeVars = {
  cardId: string;
  action: "like" | "unlike";
  // Optional metadata used for optimistic UI when adding a like
  title?: string;
  content?: string;
  type?: "career" | "testimony" | "card";
};

const PROFILE_QUERY_KEY = "profile";

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, action }: ToggleLikeVars) =>
      toggleLike(cardId, action),
    onMutate: async ({
      cardId,
      action,
      title,
      content,
      type,
    }: ToggleLikeVars) => {
      await queryClient.cancelQueries({ queryKey: [PROFILE_QUERY_KEY] });

      const previous = queryClient.getQueryData<UserProfile>([
        PROFILE_QUERY_KEY,
      ]);

      if (!previous) return { previous } as const;

      const currentLikes = previous.user.likes ?? [];
      let nextLikes: UserProfileLike[];

      if (action === "unlike") {
        nextLikes = currentLikes.filter(l => l.cardId !== cardId);
      } else {
        const exists = currentLikes.some(l => l.cardId === cardId);
        if (exists) {
          nextLikes = currentLikes;
        } else {
          nextLikes = [
            ...currentLikes,
            {
              cardId,
              title: title ?? "",
              content: content ?? "",
              type: (type ?? "card") as UserProfileLike["type"],
            },
          ];
        }
      }

      const next: UserProfile = {
        ...previous,
        user: {
          ...previous.user,
          likes: nextLikes,
        },
      };

      queryClient.setQueryData([PROFILE_QUERY_KEY], next);
      return { previous } as const;
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([PROFILE_QUERY_KEY], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
  });
}
