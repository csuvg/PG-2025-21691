import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import Tag from "@/components/ui/tag";
import type { ExploreCardItem, ExploreCardType } from "@/data/explore.const";
import {
  DEFAULT_ICON,
  EXPLORE_ICON_MAP,
  getAccentColor,
} from "@/data/explore.maps";
import { Icon } from "@roninoss/icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { toast } from "sonner-native";

// Optimized spring config for card animations
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

const MAP_TYPE_TO_TEXT: Record<ExploreCardType, string> = {
  short_question: "Pregunta corta",
  career: "Carrera",
  testimony: "Historia de egresado",
  what_if: "¿Y si...?",
};

type ExploreCardProps = {
  card: ExploreCardItem;
  // animation inputs
  bookmarked?: boolean;
  index?: number;
  snap?: number;
  scrollX?: SharedValue<number>;
  width?: number;
  height?: number;
  onToggleLike?: () => void;
  isLiked?: boolean;
  onToggleBookmark: () => void;
};

export default function ExploreCard({
  card,
  bookmarked,
  index = 0,
  snap = 1,
  scrollX,
  width,
  height,
  onToggleLike,
  isLiked,
  onToggleBookmark,
}: ExploreCardProps) {
  const { theme } = useUnistyles();
  const accentColor = getAccentColor(card.type);
  const headingColor = accentColor;
  const typeIcon = EXPLORE_ICON_MAP[card.type] ?? DEFAULT_ICON;
  const color = accentColor ?? theme.colors.accents.blueish;

  const cardRadius = theme.radius["xl"];
  const cardPadding = theme.gap(0.75);
  const innerCardRadius = cardRadius - cardPadding;

  const pressed = useSharedValue(0);

  function navigateToCard() {
    const payload = encodeURIComponent(JSON.stringify(card));
    router.push(`/(app)/(tabs)/explore/${card.id}?card=${payload}`);
  }

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollX) return {} as any;
    const x = scrollX.value;
    const center = index * snap;
    // Clamp distance to reduce work and avoid extreme values
    const d = Math.max(-1, Math.min(1, (x - center) / snap));
    // Subtle parallax + scale for performance
    const scale = interpolate(d, [-1, 0, 1], [0.98, 1, 0.98]);
    const translateY = interpolate(d, [-1, 0, 1], [16, 0, 16]);
    const rotation = interpolate(d, [-1, 0, 1], [5, 0, -5]);

    return {
      transform: [{ translateY }, { scale }, { rotate: `${rotation}deg` }],
    };
  }, [index, snap]);

  const pressAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pressed.value, [0, 1], [1, 0.88]);
    return {
      opacity: opacity,
    };
  });

  const [liked, setLiked] = useState<boolean>(isLiked ?? false);

  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(0.8);
  const overlayOpacityStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const overlayIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: overlayScale.value }],
  }));

  const handleToggleLike = () => {
    const next = !liked;
    setLiked(next);
    if (onToggleLike) onToggleLike();

    // Minimal toast feedback centralized here
    toast.success(
      next ? "Contenido marcado con Me gusta" : "Me gusta eliminado"
    );

    // Overlay animation only when liking
    if (next) {
      overlayOpacity.value = 1;
      overlayScale.value = 0.8;
      overlayScale.value = withSpring(1.15, SPRING_CONFIG);
      overlayOpacity.value = withTiming(0, { duration: 450 });
    }
  };

  const handleToggleBookmark = () => {
    onToggleBookmark();
  };

  return (
    <Animated.View
      key={card.id}
      accessibilityLabel={card.title}
      accessibilityRole="button"
      accessibilityHint="Toca para ver más información"
      accessibilityState={{ selected: liked, checked: bookmarked }}
      accessibilityActions={[
        { name: "like", label: "Me gusta" },
        { name: "bookmark", label: "Guardar" },
      ]}
      style={[
        styles.cardOuter,
        animatedStyle,
        pressAnimatedStyle,
        { width, height, borderRadius: cardRadius },
      ]}
    >
      <Animated.View style={[styles.cardMiddle, { borderRadius: cardRadius }]}>
        <View
          style={[
            styles.cardInner,
            { borderColor: color, borderRadius: innerCardRadius },
          ]}
        >
          <LinearGradient
            colors={[accentColor, theme.colors.background]}
            start={{ x: 0, y: -2 }}
            end={{ x: 0, y: 1 }}
            style={styles.media}
          />

          <View style={styles.backgroundIcon}>
            <Icon
              name={typeIcon as any}
              size={400}
              color={theme.colors.background}
              namingScheme="sfSymbol"
            />
          </View>

          <View style={styles.iconWrap}>
            <View
              style={[
                styles.typeLabel,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Heading
                level={5}
                style={{
                  color: headingColor ?? theme.colors.typography,
                }}
              >
                {MAP_TYPE_TO_TEXT[card.type]}
              </Heading>
            </View>
            <View style={styles.iconContainer}>
              <Icon
                name={typeIcon as any}
                size={18}
                color={headingColor ?? theme.colors.typography}
                namingScheme="sfSymbol"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={navigateToCard}
            activeOpacity={0.8}
            style={styles.touchArea}
          >
            <View style={styles.innerContent}>
              {card.tags && card.tags.length > 0 ? (
                <View style={styles.tagsRow}>
                  {card.tags.slice(0, 3).map(tag => (
                    <Tag key={tag}>
                      {tag
                        .split(" ")
                        .map(
                          word =>
                            word.charAt(0).toLocaleUpperCase("es-ES") +
                            word.slice(1)
                        )
                        .join(" ")}
                    </Tag>
                  ))}
                </View>
              ) : null}
              <Heading
                level={1}
                style={{
                  color: headingColor ?? theme.colors.typography,
                  marginRight: theme.gap(0.25),
                }}
              >
                {card.title}
              </Heading>
              {card.type === "testimony" && card.careerMetadata?.careerName ? (
                <Paragraph
                  style={[
                    styles.careerName,
                    {
                      color: headingColor ?? theme.colors.typography,
                    },
                  ]}
                >
                  {card.careerMetadata.careerName}
                </Paragraph>
              ) : null}
              {card.content ? (
                <Paragraph
                  style={styles.meta}
                  size="sm"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {card.content}
                </Paragraph>
              ) : null}
            </View>
          </TouchableOpacity>

          {card.type !== "what_if" && (
            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bookmark"
                hitSlop={8}
                onPress={handleToggleBookmark}
                style={[styles.likeWrap]}
              >
                <Icon
                  name={bookmarked ? "bookmark.fill" : "bookmark"}
                  namingScheme="sfSymbol"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Like"
                hitSlop={8}
                onPress={handleToggleLike}
                style={[styles.likeWrap]}
              >
                <Icon
                  name={liked ? "heart.fill" : "heart"}
                  namingScheme="sfSymbol"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            </View>
          )}
        </View>
        {/* Center like overlay (render outside cardInner to avoid overflow clipping) */}
        <Animated.View
          pointerEvents="none"
          style={[styles.likeOverlay, overlayOpacityStyle]}
        >
          <Animated.View style={overlayIconAnimatedStyle}>
            <Icon
              name="heart.fill"
              size={64}
              color={theme.colors.accents.pink}
              namingScheme="sfSymbol"
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  cardOuter: {
    height: "65%",
    borderWidth: rt.colorScheme === "dark" ? 0.5 : 0,
    borderTopColor: theme.colors.neutral[700],
    borderColor:
      rt.colorScheme === "dark"
        ? theme.colors.neutral[800]
        : theme.colors.neutral[300],
    borderRadius: theme.radius["xl"],
    backgroundColor: theme.colors.background,
  },
  cardMiddle: {
    flex: 1,
    borderRadius: theme.radius["xl"],
    borderWidth: 0,
    borderColor: theme.colors.borderSubtle,
    padding: theme.gap(0.75),
  },
  cardInner: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: theme.colors.background,
    overflow: "hidden",
  },
  media: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderRadius: theme.radius["lg"],
    bottom: 0,
  },
  backgroundIcon: {
    position: "absolute",
    top: "15%",
    right: "-30%",
    opacity: 0.5,
    zIndex: 0,
  },
  innerContent: {
    position: "absolute",
    left: theme.gap(1),
    right: theme.gap(1),
    bottom: theme.gap(7),
    gap: theme.gap(0.5),
    zIndex: 1,
  },
  touchArea: {
    flex: 1,
  },
  meta: {
    color: theme.colors.textSecondary,
  },
  careerName: {
    marginTop: theme.gap(-0.25),
    fontSize: 17,
    fontFamily: "InstrumentSans_600SemiBold",
  },
  tagsRow: {
    flexDirection: "row",
    gap: theme.gap(0.5),
    marginTop: theme.gap(0.25),
  },
  iconWrap: {
    position: "absolute",
    top: theme.gap(1),
    right: theme.gap(1),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.5),
    zIndex: 1,
  },
  iconContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.gap(0.75),
    borderRadius: theme.radius.full,
  },
  typeLabel: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.gap(1),
    paddingVertical: theme.gap(0.5),
    borderRadius: theme.radius.full,
  },
  likeWrap: {
    alignSelf: "flex-start",
    // backgroundColor: theme.colors.surface,
    // borderWidth: 1,
    borderColor:
      rt.colorScheme === "dark"
        ? theme.colors.neutral[700]
        : theme.colors.neutral[300],
    padding: theme.gap(0.75),
    borderRadius: theme.radius.full,
    zIndex: 2,
  },
  actionsRow: {
    position: "absolute",
    right: theme.gap(0),
    bottom: theme.gap(0),
    flexDirection: "row",
    padding: theme.gap(1),
    gap: theme.gap(0.5),
    justifyContent: "flex-end",
    alignItems: "center",
  },
  likeOverlay: {
    position: "absolute",
    top: theme.gap(0.75),
    left: theme.gap(0.75),
    right: theme.gap(0.75),
    bottom: theme.gap(0.75),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 100,
  },
}));
