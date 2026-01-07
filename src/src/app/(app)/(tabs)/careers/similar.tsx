import { useSimilarCareers } from "@/api/career";
import CareerCard from "@/components/career/career-card";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const LoadingSpinner = withUnistyles(ActivityIndicator, theme => ({
  color: theme.colors.tint,
}));

export default function SimilarCareersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: similarCareers, isLoading, error } = useSimilarCareers(id);
  const bottomTabBarHeight = useBottomTabBarHeight();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: bottomTabBarHeight + 32 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: "Carreras Similares",
          headerBackTitle: "Atrás",
        }}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="small" />
        </View>
      )}
      {similarCareers?.similar_career.map((career, idx) => (
        <CareerCard
          recommendation={{
            career: {
              career_id: career._id,
              name: career.name,
              image_url: career.image_url,
              description: career.description,
              duration: career.duration,
              employability: career.employability,
              faculty: career.faculty,
            },
            score: parseFloat(career.similarity_score.toFixed(3)) * 100,
            why_pos: "",
            why_neg: "",
            enhanced_explanation: {
              positive_summary: "",
              concerns_summary: "",
              personalized_advice: "",
            },
            compatibility_pct:
              parseFloat(career.similarity_score.toFixed(3)) * 100,
          }}
          rank={idx + 1}
          key={career._id}
          similarityVariant
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.gap(2),
    gap: theme.gap(1.5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
