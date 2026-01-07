import { CareerRecommendation } from "@/api/career";
import CareerCard from "@/components/career/career-card";
import Heading from "@/components/ui/heading";
import { Icon } from "@roninoss/icons";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface CareerRecommendationsProps {
  recommendations?: CareerRecommendation[];
}

export default function CareerRecommendations({
  recommendations,
}: CareerRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;
  const { theme } = useUnistyles();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Header Section */}
        <Icon name="trophy" size={16} color={theme.colors.textSecondary} />
        <Heading level={6} color="tertiary">
          Tus 5 Mejores Carreras
        </Heading>
      </View>

      {/* Career Cards */}
      <View style={styles.cardsContainer}>
        {recommendations.slice(0, 5).map((recommendation, index) => (
          <CareerCard
            key={recommendation.career.career_id}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    // Removed flex: 1 to allow proper scrolling within ScrollView parent
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.75),
    marginBottom: theme.gap(1.5),
  },
  cardsContainer: {
    gap: theme.gap(1.5),
  },
  errorText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
}));
