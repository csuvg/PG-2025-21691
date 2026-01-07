import { CareerRecommendation } from "@/api/career";
import AnimatedProgressBar from "@/components/ui/animated-progress-bar";
import Heading from "@/components/ui/heading";
import { Icon } from "@roninoss/icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface CareerCardProps {
  recommendation: CareerRecommendation;
  rank: number;
  similarityVariant?: boolean;
}

export default function CareerCard({
  recommendation,
  rank,
  similarityVariant = false,
}: CareerCardProps) {
  const { theme, rt } = useUnistyles();

  const cardPadding = theme.gap(1);
  const badgeRadius = theme.radius["lg"];
  const cardRadius = cardPadding + badgeRadius;

  // Rotate through accent colors for variety
  const accentKeys = ["blue", "pink", "yellow", "lavender", "blueish"] as const;
  const accentKey = accentKeys[(rank - 1) % accentKeys.length];
  const accentColor = theme.colors.accents[accentKey];
  const accentDimmed = theme.colors.accentsDimmed[accentKey];
  const accentExtraDimmed = theme.colors.accentsExtraDimmed[accentKey];

  // Convert compatibility_pct (0-100) to 0-1 for progress bar
  const compatibilityDecimal = recommendation.compatibility_pct / 100;

  // Gradient colors with accent color
  const gradientColors =
    rt.colorScheme === "light"
      ? (["rgba(255,255,255,0.9)", accentExtraDimmed, "white"] as const)
      : ([
          "transparent",
          accentExtraDimmed,
          theme.colors.surfaceElevated,
        ] as const);

  return (
    <Link
      href={{
        pathname: "/(app)/(tabs)/careers/[id]",
        params: {
          id: recommendation.career.career_id,
          title: recommendation.career.name,
          description: recommendation.career.description,
          duration: `${recommendation.career.duration} años`,
          employability: recommendation.career.employability,
          faculty: recommendation.career.faculty,
          coverImageUrl: recommendation.career.image_url || "",
        },
      }}
      style={[styles.card, { borderRadius: cardRadius, padding: cardPadding }]}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        {/* Subtle background cover image */}
        {recommendation.career.image_url ? (
          <>
            <Image
              source={{ uri: recommendation.career.image_url }}
              style={styles.coverImage}
              contentFit="cover"
              blurRadius={0}
              id={`career-card-cover-image-${recommendation.career.career_id}`}
            />
            <LinearGradient
              colors={gradientColors}
              locations={
                rt.colorScheme === "light"
                  ? undefined
                  : ([0.2, 0.8, 1] as const)
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: -1 }}
              style={styles.coverOverlay}
            />
          </>
        ) : null}

        {/* Top Row: Rank and Duration */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.rankBadge,
              {
                borderRadius: badgeRadius,
                borderColor: accentDimmed,
              },
            ]}
          >
            <Text style={[styles.rankText, { color: accentColor }]}>
              {rank}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoItem,
                {
                  borderRadius: badgeRadius,
                  backgroundColor: theme.colors.surfaceElevated,
                },
              ]}
            >
              <Icon
                name="clock.fill"
                namingScheme="sfSymbol"
                size={12}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.infoText}>
                {recommendation.career.duration} años
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomRow}>
          <View style={styles.nameContainer}>
            <Heading level={4} style={{ color: theme.colors.textPrimary }}>
              {recommendation.career.name}
            </Heading>
            <View style={styles.descriptionTextContainer}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "InstrumentSans_600SemiBold",
                  // color: accentColor,
                  color: theme.colors.textPrimary,
                }}
              >
                {recommendation.compatibility_pct.toFixed(1)} %
              </Text>
              <Text style={styles.descriptionText}>
                {similarityVariant ? "Similitud" : "Compatible"}
              </Text>
            </View>
          </View>
          <AnimatedProgressBar
            progress={compatibilityDecimal}
            accent={accentColor}
            height={6}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  card: {
    height: 140,
    borderRadius: theme.radius.lg,
    backgroundColor:
      rt.colorScheme === "light" ? "white" : theme.colors.surface,
    borderColor:
      rt.colorScheme === "light"
        ? theme.colors.borderSubtle
        : theme.colors.neutral[800],
    borderWidth: 2,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: rt.colorScheme === "light" ? 0.175 : 0.25,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderWidth: 0.75,
    justifyContent: "center",
    backgroundColor:
      rt.colorScheme === "light"
        ? theme.colors.surface
        : theme.colors.neutral[800],
    alignItems: "center",
  },
  rankText: {
    fontSize: 14,
    fontFamily: "InstrumentSans_600SemiBold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.75),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.gap(1),
    paddingVertical: theme.gap(0.5),
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: "InstrumentSans_500Medium",
  },
  bottomRow: {
    gap: theme.gap(1),
  },
  nameContainer: {
    gap: theme.gap(0.2),
    flexDirection: "column",
    alignItems: "flex-start",
  },
  descriptionTextContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.gap(0.5),
  },
  descriptionText: {
    color: theme.colors.textSecondary,
    fontSize: 13.5,
    fontFamily: "Inter_500Medium",
  },
}));
