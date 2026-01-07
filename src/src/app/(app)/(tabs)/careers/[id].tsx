import {
  useCareer,
  useGenerateWhatIfQuestion,
  useResults,
  type CareerTag,
  type DevelopmentArea,
} from "@/api/career";
import { useBookmark, useBookmarks, useRemoveBookmark } from "@/api/profile";
import AnimatedCareerHeader, {
  AnimatedHeaderBackground,
} from "@/components/career/animated-career-header";
import AnimatedCoverImage from "@/components/career/animated-cover-image";
import CareerHeader from "@/components/career/career-header";
import DevelopmentAreaCard from "@/components/career/development-area-card";
import GradientBorderButton from "@/components/career/gradient-border-button";
import SalaryChart from "@/components/career/salary-chart";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import Skeleton from "@/components/ui/skeleton";
import Tag from "@/components/ui/tag";
import { useAnalytics } from "@/hooks/use-analytics";
import { useScreenTimer } from "@/hooks/use-screen-timer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Icon } from "@roninoss/icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { toast } from "sonner-native";

function truncateIfTooLong(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

export default function Career() {
  const {
    id,
    title,
    description,
    duration,
    employability,
    faculty,
    coverImageUrl,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    duration: string;
    employability: string;
    faculty: string;
    description: string;
    coverImageUrl: string;
  }>();

  const { careerViewed, careerSaved } = useAnalytics();
  const { mutate: bookmark } = useBookmark();
  const { mutate: removeBookmark } = useRemoveBookmark();
  const { data: bookmarks } = useBookmarks();
  const initiallyBookmarked = useMemo(
    () => bookmarks?.items.some(i => i.item_id === (id as string)) ?? false,
    [bookmarks, id]
  );
  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);

  useEffect(() => {
    setIsBookmarked(initiallyBookmarked);
  }, [initiallyBookmarked]);

  useEffect(() => {
    if (id && title) {
      careerViewed(id as string, title as string);
    }
  }, [id, title]);

  // Time spent inside a specific career detail (dedicated event)
  useScreenTimer(
    "career_detail",
    {
      careerId: id,
      careerName: title,
    },
    "career_detail_time"
  );

  const { data: career, isLoading, error } = useCareer(id as string);

  const { theme, rt } = useUnistyles();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const shortCareerName = truncateIfTooLong(title, 30);

  const { data: whatIf, error: whatIfError } = useGenerateWhatIfQuestion(
    id as string
  );

  // const [showButton, setShowButton] = useState(false);

  // Pull quiz results to surface the enhanced explanation for this career
  const { data: results } = useResults();
  const matchedExplanation = useMemo(() => {
    const rec = results?.results?.recommendations?.find(
      r => r.career.career_id === (id as string)
    );
    return rec?.enhanced_explanation;
  }, [results, id]);

  const { top: statusBarHeight } = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: bottomTabBarHeight + 32 }),
    [bottomTabBarHeight]
  );

  function handleBookmark() {
    if (isBookmarked) {
      const bookmarkId = bookmarks?.items.find(
        i => i.item_id === (id as string)
      )?._id;
      if (bookmarkId) {
        removeBookmark({ bookmarkId });
      }
      setIsBookmarked(false);
      toast.success("Carrera eliminada de tus favoritos", {
        position: "bottom-center",
      });
    } else {
      bookmark({ itemId: id as string, isCareer: true });
      setIsBookmarked(true);
      // Capture analytics with name and tags (if available)
      const tags = career?.tags?.map((t: CareerTag) => ({
        id: t._id,
        name: t.name,
      }));
      careerSaved(
        id as string,
        (title as string) ?? career?.nombre_carrera,
        tags
      );
      toast.success("Carrera agregada a tus favoritos", {
        position: "bottom-center",
      });
    }
  }

  function handleWhatIf() {
    if (!whatIf?.shortQuestion) return;
    router.push({
      pathname: "/(app)/(tabs)/careers/what-if",
      params: {
        question: whatIf?.completeQuestion,
        newCareerId: whatIf?.newCareerId,
      },
    });
  }

  // Commented out: Logic to hide/show what-if button based on scroll distance
  // function handleScroll(e: any) {
  //   const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
  //   const distanceFromBottom =
  //     contentSize.height - (contentOffset.y + layoutMeasurement.height);

  //   if (distanceFromBottom < 100 && !showButton) {
  //     setShowButton(true);
  //   } else if (distanceFromBottom > 100 && showButton) {
  //     setShowButton(false);
  //   }
  // }

  return (
    <Animated.ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      ref={scrollRef}
      contentContainerStyle={contentContainerStyle}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
      // onScroll={handleScroll}
    >
      <Stack.Screen
        options={{
          title: shortCareerName,
          headerTransparent: true,
          headerBackTitle: "Atrás",
          headerBlurEffect: rt.colorScheme === "dark" ? "dark" : "light",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackground: () => (
            <AnimatedHeaderBackground
              scrollOffset={scrollOffset}
              statusBarHeight={statusBarHeight}
              backgroundColor={theme.colors.background}
            />
          ),
          headerTitle: () => (
            <AnimatedCareerHeader
              title={shortCareerName}
              scrollOffset={scrollOffset}
              statusBarHeight={statusBarHeight}
              backgroundColor={theme.colors.background}
            />
          ),
          headerRight: () => (
            <Pressable
              onPressOut={handleBookmark}
              hitSlop={{ top: 8, right: 12, bottom: 8, left: 12 }}
              accessibilityRole="button"
            >
              <Icon
                name={isBookmarked ? "bookmark.fill" : "bookmark"}
                size={22}
                color={
                  isBookmarked ? theme.colors.tint : theme.colors.textPrimary
                }
                namingScheme="sfSymbol"
              />
            </Pressable>
          ),
        }}
      />
      <AnimatedCoverImage
        imageUrl={career?.image_url || (coverImageUrl as string)}
        scrollOffset={scrollOffset}
      />

      <View style={styles.content}>
        <CareerHeader
          title={title}
          description={description}
          duration={duration}
          employability={employability}
          faculty={faculty}
        />

        {/* Display career tags if available from API */}
        {!career?.tags ? (
          <View style={{ gap: theme.gap(1), flexDirection: "row" }}>
            <Skeleton
              style={[
                styles.skeleton,
                { width: "15%", borderRadius: theme.radius.md },
              ]}
            />
            <Skeleton
              style={[
                styles.skeleton,
                { width: "15%", borderRadius: theme.radius.md },
              ]}
            />
            <Skeleton
              style={[
                styles.skeleton,
                { width: "15%", borderRadius: theme.radius.md },
              ]}
            />
          </View>
        ) : (
          career.tags.length > 0 && (
            <ScrollView
              style={styles.scrollView}
              nestedScrollEnabled={true}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagContainer}
            >
              {career?.tags
                .sort((a: CareerTag, b: CareerTag) => b.score - a.score)
                .slice(0, 5)
                .map((tag: CareerTag, index: number) => (
                  <Tag key={index} size="base" capitalize>
                    {tag.name}
                  </Tag>
                ))}
            </ScrollView>
          )
        )}
        <Divider />

        {/* API-dependent sections with loading states */}
        {isLoading && !career ? (
          <View style={styles.loadingSection}>
            <Skeleton style={[styles.skeleton, { width: "75%" }]} />
            <Skeleton style={[styles.skeleton, { height: 100 }]} />
          </View>
        ) : error ? (
          <View style={styles.errorSection}>
            <Icon
              name="exclamationmark"
              size={24}
              color={theme.colors.dimmed}
              namingScheme="sfSymbol"
            />
            <Paragraph size="sm" style={{ color: theme.colors.textSecondary }}>
              No se pudieron cargar los detalles completos
            </Paragraph>
          </View>
        ) : career ? (
          <>
            {matchedExplanation && (
              <View
                style={[
                  styles.aiCard,
                  {
                    borderColor: theme.colors.tintDimmed,
                    backgroundColor: theme.colors.tintExtraDimmed,
                    borderStyle: "solid",
                  },
                ]}
              >
                <View style={styles.aiHeader}>
                  <View style={styles.aiHeaderLeft}>
                    <Icon
                      name="sparkle"
                      size={20}
                      color={theme.colors.tint}
                      namingScheme="sfSymbol"
                    />
                    <Heading level={4} color="primary">
                      Tu Análisis
                    </Heading>
                  </View>
                  {(() => {
                    const recs = results?.results?.recommendations || [];
                    const idx = recs.findIndex(
                      r => r.career.career_id === (id as string)
                    );
                    if (idx === -1) return null;
                    const rank = idx + 1;
                    const label =
                      rank <= 3 ? `Top ${rank} para ti` : `Posición #${rank}`;
                    return (
                      <View
                        style={[
                          styles.pill,
                          {
                            borderColor: theme.colors.tintDimmed,
                            backgroundColor: theme.colors.surface,
                          },
                        ]}
                      >
                        <Paragraph size="sm" style={styles.pillText as any}>
                          {label}
                        </Paragraph>
                      </View>
                    );
                  })()}
                </View>
                {matchedExplanation.positive_summary ? (
                  <Paragraph size="sm" color="secondary">
                    {matchedExplanation.positive_summary}
                  </Paragraph>
                ) : null}
                {matchedExplanation.concerns_summary ? (
                  <Paragraph size="sm" color="secondary">
                    {matchedExplanation.concerns_summary}
                  </Paragraph>
                ) : null}
                {matchedExplanation.personalized_advice ? (
                  <Paragraph size="sm" color="secondary">
                    {matchedExplanation.personalized_advice}
                  </Paragraph>
                ) : null}
              </View>
            )}
            <View style={styles.section}>
              <Heading level={5}>Panorama Laboral</Heading>
              <Paragraph size="sm" color="secondary">
                Los salarios son estimados y pueden variar según la región y la
                experiencia.
              </Paragraph>
              <SalaryChart
                min={career.salario_minimo}
                max={career.salario_maximo}
                currency={career.moneda_salario}
              />
            </View>
            {career.perfil_del_egresado && (
              <View style={styles.section}>
                <Heading level={5}>Perfil del Egresado</Heading>
                <Paragraph size="sm" color="secondary">
                  {career.perfil_del_egresado}
                </Paragraph>
              </View>
            )}
          </>
        ) : null}
        {career?.areas_de_desarrollo_potencial &&
          career.areas_de_desarrollo_potencial.length > 0 && (
            <View style={styles.section}>
              <Heading level={5}>Áreas de Desarrollo Potencial</Heading>
              <View style={styles.areasContainer}>
                {career.areas_de_desarrollo_potencial.map(
                  (area: DevelopmentArea, index: number) => (
                    <DevelopmentAreaCard
                      key={area._id || `area-${index}`}
                      area={area}
                      index={index}
                    />
                  )
                )}
              </View>
            </View>
          )}

        <Divider />
        <View style={styles.section}>
          {/* Button Actions - available even without full API data */}
          <Button
            title="Ver Pensum"
            variant="secondary"
            style={styles.actionButton}
            disabled={!career}
            icon={
              <Icon
                name="book.fill"
                size={20}
                color={
                  career ? theme.colors.textPrimary : theme.colors.textSecondary
                }
                namingScheme="sfSymbol"
              />
            }
            onPress={() => {
              if (career) {
                router.push(
                  `/(app)/(tabs)/careers/curriculum?id=${career._id}`
                );
              }
            }}
          />
          <Button
            title="Carreras Similares"
            variant="secondary"
            style={styles.actionButton}
            disabled={!career}
            icon={
              <Icon
                name="asterisk"
                size={20}
                color={
                  career ? theme.colors.textPrimary : theme.colors.textSecondary
                }
                namingScheme="sfSymbol"
              />
            }
            onPress={() => {
              if (career) {
                router.push(`/(app)/(tabs)/careers/similar?id=${career._id}`);
              }
            }}
            textStyle={{
              color: career
                ? theme.colors.textPrimary
                : theme.colors.textSecondary,
            }}
          />

          {/* Always show what-if button when available */}
          {whatIf?.shortQuestion && (
            <GradientBorderButton
              title={whatIf?.shortQuestion || "¿Y si combinas con...?"}
              onPress={handleWhatIf}
              disableEffect={!career && !title}
            />
          )}
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skeleton: {
    height: 20,
    borderRadius: theme.radius.md,
  },
  content: {
    padding: theme.gap(2),
    gap: theme.gap(2),
    backgroundColor: theme.colors.background,
  },
  section: {
    gap: theme.gap(1),
  },
  aiCard: {
    gap: theme.gap(1),
    padding: theme.gap(2),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.gap(0.5),
  },
  aiHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.75),
  },
  pill: {
    paddingHorizontal: theme.gap(1),
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: theme.colors.tint,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.gap(0.5),
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.gap(0.5),
    // backgroundColor: theme.colors.surfaceElevated,
  },
  verticalSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.gap(1),
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  tags: {
    justifyContent: "flex-start",
    gap: theme.gap(0.75),
  },
  scrollView: {
    gap: theme.gap(1),
  },
  tagContainer: {
    flexDirection: "row",
    gap: theme.gap(0.75),
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    gap: theme.gap(2),
  },
  loadingSection: {
    gap: theme.gap(1.5),
  },
  errorSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.gap(3),
    gap: theme.gap(1.5),
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  readMoreButton: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  readMoreButtonText: {
    color: theme.colors.tint,

    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  areasContainer: {
    paddingTop: theme.gap(1.5),
    gap: theme.gap(1.5),
  },
}));
