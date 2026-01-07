import CardDetail from "@/components/explore/card-detail";
import { type ExploreCardItem } from "@/data/explore.const";
import { useLocalSearchParams } from "expo-router";

export default function ExploreDetailScreen() {
  const { card } = useLocalSearchParams<{ id: string; card?: string }>();

  if (!card) return null;

  let cardData = JSON.parse(decodeURIComponent(card)) as ExploreCardItem;

  return <CardDetail cardData={cardData} />;
}
