import Paragraph from "@/components/ui/paragraph";
import Skeleton from "@/components/ui/skeleton";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const AnimatedParagraph = Animated.createAnimatedComponent(Paragraph);

type WhatIfContentProps = {
  content: string | null | undefined;
  isLoading?: boolean;
  delayOffset?: number;
};

export default function WhatIfContent({
  content,
  isLoading = false,
  delayOffset = 0,
}: WhatIfContentProps) {
  if (isLoading) {
    return (
      <View style={{ gap: 8, width: "100%" }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            style={{
              width: `${100 - index * 10}%`,
              height: 24,
              opacity: 1 - index * 0.4,
            }}
          />
        ))}
      </View>
    );
  }

  const miniInform = content?.trim();
  if (!miniInform || miniInform.length === 0) {
    return (
      <Paragraph color="secondary">No hay contenido disponible.</Paragraph>
    );
  }

  const paragraphs = miniInform
    .split("\n\n")
    .filter(paragraph => paragraph.trim().length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: 8, width: "100%" }}>
      {paragraphs.map((paragraph, index) => (
        <AnimatedParagraph
          key={index}
          color="secondary"
          style={{ textAlign: "auto" }}
          entering={FadeInUp.duration(1000)
            .delay(delayOffset + index * 100)
            .springify()}
        >
          {paragraph.trim()}
        </AnimatedParagraph>
      ))}
    </View>
  );
}
