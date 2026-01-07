import type { FeedItem } from "@/api/explore";
import type { ExploreCardItem, ExploreCardType } from "@/data/explore.const";

export function mapFeedItemToCard(item: FeedItem): ExploreCardItem {
  let id: string;
  let title: string;
  let content: string;
  let careerId: string = "";
  let careerName: string = "";
  let image: string = "";
  let faculty: string = "";
  let employability: string = "";
  let duration: string = "";
  switch (item.type) {
    case "career":
      id = item._id;
      title = item.display_data.name;
      content = item.display_data.description;
      careerId = item.reference.id;
      careerName = item.display_data.name;
      image = item.display_data.image_url;
      faculty = item.display_data.faculty;
      employability = item.display_data.employability;
      duration = item.display_data.duration;
      break;
    case "what_if":
      id = `${item.display_data.question[0]}-${item.created_at}`;
      title = item.display_data.question[2];
      content = "";
      break;
    case "testimony":
      id = item._id;
      title = item.display_data.egresado;
      content = item.display_data.experiencia;
      if (item.display_data.carrera) {
        careerId = item.display_data.carrera.id;
        careerName = item.display_data.carrera.name;
      }
      break;
  }

  return {
    id,
    type: item.type as ExploreCardType,
    title,
    content,
    tags: item.display_data.tags.map(t => t.name),
    image: image ? { uri: image } : null,
    careerMetadata: {
      careerId: careerId,
      careerName: careerName || undefined,
      faculty: faculty,
      duration: duration,
      employability: employability,
      coverImageUrl: image,
    },
  };
}
