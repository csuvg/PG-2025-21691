import { useGenerateWhatIfContent } from "@/api/career";
import WhatIfContent from "@/components/career/what-if-content";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import Paragraph from "@/components/ui/paragraph";
import Tag from "@/components/ui/tag";
import {
  type ExploreCardItem,
  type ExploreCardType,
} from "@/data/explore.const";
import {
  DEFAULT_ACCENT_COLOR,
  EXPLORE_ICON_MAP,
  getAccentColor,
} from "@/data/explore.maps";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Icon } from "@roninoss/icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Spacer from "../ui/spacer";

type CardDetailProps = {
  cardData: ExploreCardItem;
};

const MAP_TYPE_TO_TEXT: Record<ExploreCardType, string> = {
  short_question: "Pregunta corta",
  career: "Carrera",
  testimony: "Historia de egresado",
  what_if: "¿Y si...?",
};

export default function CardDetail({ cardData }: CardDetailProps) {
  const insets = useSafeAreaInsets();
  const { theme, rt } = useUnistyles();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const question = cardData.type === "what_if" ? cardData.title : "";

  const { data: content, isLoading: generatingContent } =
    useGenerateWhatIfContent(question);

  useEffect(() => {
    console.log("<WHAT IF CONTENT>", JSON.stringify(content, null, 2));
  }, [content]);

  if (!cardData) return null;

  return (
    <Transition.ScrollView
      style={[styles.container, { marginBottom: bottomTabBarHeight }]}
    >
      <View style={[{ paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Icon
              name="xmark"
              size={16}
              color={theme.colors.textPrimary}
              namingScheme="sfSymbol"
            />
          </Pressable>
          <View style={styles.handleBar} />
          <Icon
            name="xmark"
            size={16}
            color={"transparent"}
            namingScheme="sfSymbol"
          />
        </View>

        <View style={styles.content}>
          <View style={{ gap: theme.gap(0.5) }}>
            <View style={styles.badge}>
              <Icon
                name={EXPLORE_ICON_MAP[cardData.type] as any}
                color={theme.colors.textSecondary}
                size={18}
                namingScheme="sfSymbol"
              />
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                {MAP_TYPE_TO_TEXT[cardData.type]}
              </Text>
            </View>
            <Text
              style={[
                styles.title,
                {
                  color: getAccentColor(cardData.type) ?? DEFAULT_ACCENT_COLOR,
                },
              ]}
            >
              {cardData.title}
            </Text>
          </View>

          {cardData.tags && cardData.tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {cardData.tags.map(tag => (
                <Tag key={tag} capitalize>
                  {tag}
                </Tag>
              ))}
            </View>
          ) : null}

          <Divider />

          {/* Render what-if content */}
          {cardData.type === "what_if" ? (
            <WhatIfContent
              content={content?.mini_inform}
              isLoading={generatingContent}
              delayOffset={400}
            />
          ) : cardData.content ? (
            <Paragraph size="base" style={styles.longText}>
              {cardData.content}
            </Paragraph>
          ) : null}

          {/* Show "Open in Detail" button for careers */}
          {cardData.type === "career" && (
            <>
              <Divider />
              <Button
                variant="primary"
                onPress={() => {
                  router.push({
                    pathname: "/(app)/(tabs)/careers/[id]",
                    params: {
                      title: cardData.title,
                      description: cardData.content,
                      id: cardData.careerMetadata?.careerId || "",
                      duration: cardData.careerMetadata?.duration,
                      employability: cardData.careerMetadata?.employability,
                      faculty: cardData.careerMetadata?.faculty,
                      coverImageUrl: cardData.careerMetadata?.coverImageUrl,
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.gap(1),
                  }}
                >
                  <Paragraph
                    size="base"
                    style={{
                      color: rt.colorScheme === "light" ? "white" : "black",
                      fontFamily: "Inter_700Bold",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    Explorar más
                  </Paragraph>
                  <Icon
                    name="arrow.right"
                    size={20}
                    color={rt.colorScheme === "light" ? "white" : "black"}
                    namingScheme="sfSymbol"
                  />
                </View>
              </Button>
            </>
          )}
        </View>
      </View>
      <Spacer />
    </Transition.ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.gap(2),
    paddingBottom: theme.gap(2),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    display: "flex",
  },
  handleBar: {
    height: 4,
    width: "30%",
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.full,
  },
  backButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.gap(0.75),
    borderRadius: theme.radius.full,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.gap(3),
    gap: theme.gap(2),
  },
  tagsRow: {
    flexDirection: "row",
    gap: theme.gap(1),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 17,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
  },
  title: {
    fontSize: 32,
    fontFamily: "InstrumentSans_700Bold",
    color: theme.colors.textPrimary,
    lineHeight: 40,
  },
  description: {
    fontSize: 17,
    fontFamily: "InstrumentSans_400Regular",
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  longText: {
    color: theme.colors.textSecondary,
    lineHeight: 26,
  },
}));
