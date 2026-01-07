import type { ImageSource } from "expo-image";

export type ExploreCardType =
  | "short_question"
  | "career"
  | "testimony"
  | "what_if";

export type ExploreCardItem = {
  id: string;
  type: ExploreCardType;
  title: string;
  content: string;
  tags: string[];
  image?: ImageSource | null;
  careerMetadata?: {
    careerId: string;
    careerName?: string;
    faculty: string;
    duration: string;
    employability: string;
    coverImageUrl: string;
  };
};
