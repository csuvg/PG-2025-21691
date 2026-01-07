import { useExploreFeed, useToggleLike } from "@/api/explore";
import {
  useBookmark,
  useBookmarks,
  useProfile,
  useRemoveBookmark,
} from "@/api/profile";
import ExploreBackground from "@/components/explore/explore-background";
import ExploreCard from "@/components/explore/explore-card";
import IntroModal from "@/components/ui/intro-modal";
import { type ExploreCardItem } from "@/data/explore.const";
import { ONBOARDING_INTROS } from "@/data/onboarding.const";
import { useOnboardingStore } from "@/stores/onboarding";
import { mapFeedItemToCard } from "@/utils/card";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollOffset,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { toast } from "sonner-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Based on poker card aspect ratio.
const CARD_ASPECT_RATIO = 0.72;
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const SPACING = 16;
const CARD_HEIGHT = Math.round(CARD_WIDTH / CARD_ASPECT_RATIO);

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<ExploreCardItem>
);

export default function ExploreScreen() {
  const { theme } = useUnistyles();
  const { seen, markSeen } = useOnboardingStore();
  const [showIntro, setShowIntro] = useState(false);

  const { data: profile } = useProfile();
  const { data: bookmarks } = useBookmarks();
  const { mutateAsync: addBookmark } = useBookmark();
  const { mutateAsync: removeBookmark } = useRemoveBookmark();
  const { mutateAsync: toggleLike } = useToggleLike();
  const {
    data: feedPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExploreFeed();

  const cards = useMemo(
    () => feedPages?.pages?.flatMap(p => p.data).map(mapFeedItemToCard) ?? [],
    [feedPages, mapFeedItemToCard]
  );

  const likedCardIds = useMemo(
    () => profile?.user?.likes?.map(like => like.cardId) ?? [],
    [profile]
  );

  const bookmarkedCardIds = useMemo(
    () => bookmarks?.items.map(item => item.item_id) ?? [],
    [bookmarks]
  );

  async function handleToggleBookmark(cardId: string, isCareer: boolean) {
    if (bookmarkedCardIds.includes(cardId)) {
      // when removing we use the bookmark id, not the item itself.
      const bookmarkItemId = bookmarkedCardIds.find(id => id === cardId);
      const bookmarkId = bookmarks?.items.find(
        item => item.item._id === bookmarkItemId
      )?._id;
      toast.success("Carrera eliminada de tus favoritos");
      await removeBookmark({ bookmarkId: bookmarkId! });
    } else {
      console.log("adding bookmark", cardId, isCareer);
      toast.success("Carrera agregada a tus favoritos");
      await addBookmark({ itemId: cardId, isCareer });
    }
  }

  async function handleToggleLike(item: ExploreCardItem) {
    const isLiked = likedCardIds.includes(item.id);
    await toggleLike({
      cardId: item.id,
      action: isLiked ? "unlike" : "like",
      title: item.title,
      content: item.content ?? "",
      type: item.type === "career" ? "career" : "card",
    });
  }

  const bottomTabBarHeight = useBottomTabBarHeight();
  const top = useSafeAreaInsets();

  // Calculate vertical padding to center cards
  const availableHeight = SCREEN_HEIGHT - top.top - bottomTabBarHeight;
  const verticalPadding = Math.max(0, (availableHeight - CARD_HEIGHT) / 2);

  const scrollRef = useAnimatedRef<any>();
  const scrollX = useScrollOffset(scrollRef);

  const typesSV = useSharedValue(cards.map(d => d.type));

  useEffect(() => {
    typesSV.value = cards.map(d => d.type);
  }, [cards, typesSV]);

  useEffect(() => {
    if (!seen.explore) setShowIntro(true);
  }, [seen.explore]);

  const isInitialLoading = !feedPages || (feedPages.pages?.length ?? 0) === 0;

  return (
    <View style={styles.container}>
      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.tint} />
        </View>
      ) : null}
      <IntroModal
        visible={showIntro}
        title={ONBOARDING_INTROS.explore.title}
        body={ONBOARDING_INTROS.explore.body}
        onClose={() => {
          markSeen("explore");
          setShowIntro(false);
        }}
      />
      <ExploreBackground
        progress={scrollX}
        snap={CARD_WIDTH + SPACING * 2}
        typesSV={typesSV}
        loading={isInitialLoading}
      />
      <AnimatedFlashList
        ref={scrollRef}
        horizontal
        data={cards}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            console.debug("[ExploreScreen] Fetching next page");
            fetchNextPage();
          }
        }}
        getItemType={item => item.type}
        ItemSeparatorComponent={() => <View style={{ width: SPACING * 2 }} />}
        decelerationRate={0.9}
        snapToInterval={CARD_WIDTH + SPACING * 2}
        snapToAlignment="center"
        contentContainerStyle={{
          paddingTop: top.top + verticalPadding,
          paddingBottom: bottomTabBarHeight + verticalPadding,
          paddingHorizontal: SPACING,
        }}
        style={styles.list}
        renderItem={({ item, index }) => {
          return (
            <ExploreCard
              bookmarked={
                item.type === "career"
                  ? bookmarkedCardIds.includes(item.careerMetadata?.careerId!)
                  : bookmarkedCardIds.includes(item.id)
              }
              isLiked={likedCardIds.includes(item.id)}
              onToggleBookmark={() =>
                handleToggleBookmark(
                  item.type === "career"
                    ? item.careerMetadata?.careerId!
                    : item.id,
                  item.type === "career"
                )
              }
              onToggleLike={() => handleToggleLike(item)}
              index={index}
              scrollX={scrollX}
              snap={CARD_WIDTH + SPACING * 2}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              card={item}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  list: {
    flex: 1,
  },
}));
