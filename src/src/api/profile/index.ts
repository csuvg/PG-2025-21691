import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";

const BOOKMARKS_QUERY_KEY = "bookmarks";
const PROFILE_QUERY_KEY = "profile";

export type BookmarkType =
  | "career"
  | "card"
  | "testimony"
  | "what_if"
  | "short_question";

export interface BookmarkItem {
  _id: string;
  user_id: string;
  type: BookmarkType;
  item_id: string;
  saved_at: string;
  item: {
    _id: string;
    type?: string;
    nombre_carrera?: string;
    duration?: string;
    employability?: string;
    facultad?: string;
    descripcion?: string;
    display_data?: {
      name?: string;
      description?: string;
      question?: [string, string, string]; // for what_if types
      carrera?: {
        id: string;
        name: string;
      };
      egresado?: string;
      experiencia?: string;
      tags?: Array<{
        id: string;
        name: string;
      }>;
    };
  };
  __v: number;
}

export interface BookmarksResponse {
  items: BookmarkItem[];
  count: number;
}

export type UserProfileTag = {
  tag: string;
  name: string;
  score: number;
};

export type UserProfileLike = {
  cardId: string;
  title: string;
  content: string;
  type: "career" | "testimony" | "card";
};

export type UserProfile = {
  user: {
    _id: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    username?: string | null;
    email?: string;
    role?: string;
    tags: UserProfileTag[];
    quizCompletedAt?: string | null;
    likes?: UserProfileLike[];
  };
};

async function getProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/users/me");
  return response.data;
}

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getProfile,
  });
}

async function getBookmarks(): Promise<BookmarksResponse> {
  const response = await api.get<BookmarksResponse>("/users/saved");
  return response.data;
}

export function useBookmarks() {
  return useQuery<BookmarksResponse>({
    queryKey: [BOOKMARKS_QUERY_KEY],
    queryFn: getBookmarks,
  });
}

async function addBookmark(itemId: string, isCareer: boolean) {
  const response = await api.post("/users/saved", {
    item_id: itemId,
    type: isCareer ? "career" : "card",
  });
  return response.data;
}

export function useBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, isCareer }: { itemId: string; isCareer: boolean }) =>
      addBookmark(itemId, isCareer),
    // Optimistic update so UI reflects bookmark immediately
    onMutate: async ({
      itemId,
      isCareer,
    }: {
      itemId: string;
      isCareer: boolean;
    }) => {
      await queryClient.cancelQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });

      const previous = queryClient.getQueryData<BookmarksResponse>([
        BOOKMARKS_QUERY_KEY,
      ]);

      const alreadySaved = previous?.items?.some(i => i.item_id === itemId);
      if (alreadySaved) {
        // Nothing to do if it's already present
        return { previous } as const;
      }

      const optimisticItem: BookmarkItem = {
        _id: `optimistic-${itemId}`,
        user_id: "",
        type: isCareer ? "career" : "card",
        item_id: itemId,
        saved_at: new Date().toISOString(),
        item: {
          _id: itemId,
        },
        __v: 0,
      };

      const next: BookmarksResponse = {
        items: [...(previous?.items ?? []), optimisticItem],
        count: (previous?.count ?? 0) + 1,
      };

      queryClient.setQueryData([BOOKMARKS_QUERY_KEY], next);

      return { previous } as const;
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([BOOKMARKS_QUERY_KEY], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });
    },
  });
}

async function removeBookmark(bookmarkId: string) {
  const response = await api.delete(`/users/saved/${bookmarkId}`);
  return response.data;
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookmarkId }: { bookmarkId: string }) =>
      removeBookmark(bookmarkId),
    onMutate: async ({ bookmarkId }: { bookmarkId: string }) => {
      await queryClient.cancelQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });

      const previous = queryClient.getQueryData<BookmarksResponse>([
        BOOKMARKS_QUERY_KEY,
      ]);

      if (!previous) return { previous } as const;

      const filtered = previous.items.filter(i => i._id !== bookmarkId);
      const next: BookmarksResponse = {
        items: filtered,
        count: Math.max(0, (previous.count ?? 0) - 1),
      };
      queryClient.setQueryData([BOOKMARKS_QUERY_KEY], next);

      return { previous } as const;
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([BOOKMARKS_QUERY_KEY], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });
    },
  });
}
