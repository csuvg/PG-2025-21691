import { useResults } from "@/api/career";
import { useBookmarks, useProfile, type BookmarkItem } from "@/api/profile";
import ProfileTraitsPills from "@/components/profile/profile-traits-pills";
import SavedCard from "@/components/profile/saved-card";
import AppBackground from "@/components/ui/app-background";
import Heading from "@/components/ui/heading";
import IntroModal from "@/components/ui/intro-modal";
import Paragraph from "@/components/ui/paragraph";
import { type ExploreCardItem } from "@/data/explore.const";
import {
  DEFAULT_ACCENT_COLOR,
  EXPLORE_ACCENT_COLOR_MAP,
  type ExploreCardType,
} from "@/data/explore.maps";
import { ONBOARDING_INTROS } from "@/data/onboarding.const";
import { useOnboardingStore } from "@/stores/onboarding";
import { useUser } from "@clerk/clerk-expo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type SavedItem = ExploreCardItem & {
  likedAt: string; // ISO date
  careerMetadata?: {
    // Additional career data for navigation to full detail page
    faculty?: string;
    duration?: string;
    employability?: string;
    coverImageUrl?: string;
  };
};

// Transform bookmark items to saved items format (ExploreCardItem + likedAt)
function transformBookmarkToSavedItem(bookmark: BookmarkItem): SavedItem {
  let title = "";
  let content = "";
  let tags: string[] = [];
  let careerMetadata: SavedItem["careerMetadata"];
  const itemId = bookmark.item._id;

  console.log("bookmark", JSON.stringify(bookmark, null, 2));

  if (bookmark.type === "career") {
    // For careers
    title = bookmark.item.nombre_carrera || "Career";
    content = bookmark.item.descripcion || "";

    // Store career metadata for navigation to full detail page
    careerMetadata = {
      careerId: bookmark.item_id,
      faculty: bookmark.item.facultad || "",
      duration: bookmark.item.duration || "",
      employability: bookmark.item.employability || "N/A",
      coverImageUrl: "",
    };
  } else if (bookmark.item.display_data) {
    // For cards with display_data
    if (bookmark.item.display_data.question) {
      // what_if type with question array
      const q = bookmark.item.display_data.question;
      title = q[1] || ""; // short question
      content = q[2] || ""; // full question
    } else if (bookmark.item.display_data.carrera) {
      // testimony/alumni_story type
      title = `${bookmark.item.display_data.egresado}`;
      content = bookmark.item.display_data.experiencia || "";
    } else {
      // Other card types
      title = bookmark.item.display_data.name || "Card";
      content = bookmark.item.display_data.description || "";
    }

    // Extract tags if available
    if (bookmark.item.display_data.tags) {
      tags = bookmark.item.display_data.tags.map(t => t.name);
    }
  }

  return {
    id: itemId,
    type:
      bookmark.type === "career"
        ? "career"
        : (bookmark.item.type as ExploreCardType),
    title,
    content,
    tags,
    image: null,
    likedAt: bookmark.saved_at,
    careerMetadata,
  };
}

export default function Tab() {
  // We can safely assume that the user is logged in,
  // all routes are guarded by an active clerk session.
  const { user } = useUser();
  const { theme } = useUnistyles();
  const tabBarHeight = useBottomTabBarHeight();
  const { seen, markSeen } = useOnboardingStore();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!seen.profile) setShowIntro(true);
  }, [seen.profile]);

  const { data: profile, isLoading, error } = useProfile();
  const { data: results } = useResults();

  const {
    data: bookmarksData,
    isLoading: isBookmarksLoading,
    error: bookmarksError,
  } = useBookmarks();

  const savedCards = useMemo(() => {
    if (!bookmarksData?.items || bookmarksData.items.length === 0) return [];

    const cards = bookmarksData.items
      .map(transformBookmarkToSavedItem)
      .sort(
        (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
      );
    console.log("cards", JSON.stringify(cards, null, 2));
    return cards;
  }, [bookmarksData]);

  let email = user!.emailAddresses[0].emailAddress;
  let name = user?.fullName || email;
  let profilePicture = user!.imageUrl;

  function handleCardPress(item: SavedItem) {
    const payload = encodeURIComponent(JSON.stringify(item));
    router.push(`/(app)/(tabs)/profile/${item.id}?card=${payload}`);
  }

  return (
    <>
      <IntroModal
        visible={showIntro}
        title={ONBOARDING_INTROS.profile.title}
        body={ONBOARDING_INTROS.profile.body}
        onClose={() => {
          markSeen("profile");
          setShowIntro(false);
        }}
      />
      <FlatList
        data={savedCards}
        keyExtractor={item => item.id}
        numColumns={3}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isBookmarksLoading ? (
              <ActivityIndicator size="small" color={theme.colors.tint} />
            ) : bookmarksError ? (
              <Text style={styles.emptyText}>
                Error cargando tus elementos guardados
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                Aún no has guardado ningún elemento
              </Text>
            )}
          </View>
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <AppBackground />
              <View style={styles.avatarContainer}>
                <Image source={{ uri: profilePicture }} style={styles.avatar} />
              </View>
              <View style={styles.userInfo}>
                <Heading level={3}>{name}</Heading>
                <Paragraph
                  color="tertiary"
                  style={{
                    fontSize: 12,
                    marginTop: -theme.gap(0.5),
                  }}
                >
                  {email}
                </Paragraph>
                {/* <View style={styles.tagsWrapper}>
                  <ProfileTags items={tags} loading={isLoading} />
                </View> */}
                {results?.results?.trait_scores ? (
                  <ProfileTraitsPills
                    traitScores={results.results.trait_scores}
                    style={{
                      marginTop: theme.gap(1.5),
                      paddingHorizontal: theme.gap(1.5),
                      paddingBottom: theme.gap(0.5),
                    }}
                  />
                ) : null}
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <Heading level={5} style={{ color: theme.colors.textSecondary }}>
                Tu Colección
              </Heading>
            </View>
          </View>
        }
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <SavedCard
              id={item.id}
              title={item.title}
              accentColor={
                EXPLORE_ACCENT_COLOR_MAP[item.type] ?? DEFAULT_ACCENT_COLOR
              }
              likedAt={item.likedAt}
              onPress={() => handleCardPress(item)}
            />
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: theme.gap(1.5),
    gap: theme.gap(2),
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor:
      rt.colorScheme === "dark"
        ? theme.colors.neutral[50]
        : theme.colors.neutral[300],
    padding: theme.gap(0.33),
    borderRadius: theme.radius.full,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: theme.radius.full,
  },
  userInfo: {
    flexDirection: "column",
    alignItems: "center",
  },
  tagsWrapper: {
    marginTop: theme.gap(1.5),
    width: "100%",
    paddingHorizontal: theme.gap(1),
  },
  sectionHeader: {
    paddingHorizontal: theme.gap(1.5),
    paddingTop: theme.gap(2),
    paddingBottom: theme.gap(0.5),
  },
  gridRow: {
    paddingTop: theme.gap(1),
    paddingHorizontal: theme.gap(1),
  },
  gridItem: {
    width: "33.333%",
    aspectRatio: 2 / 3,
    padding: theme.gap(0.5),
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.gap(4),
    paddingHorizontal: theme.gap(2),
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: "center",
  },
}));
