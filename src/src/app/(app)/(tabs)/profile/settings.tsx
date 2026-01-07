import { useDeleteQuizResults } from "@/api/quiz";
import SignOutButton from "@/components/auth/sign-out-button";
import PrivacyPolicySheet from "@/components/privacy/privacy-policy-sheet";
import Divider from "@/components/ui/divider";
import Heading from "@/components/ui/heading";
import { useAnalytics } from "@/hooks/use-analytics";
import { cleanupQuizData } from "@/utils/auth-cleanup";
import { Icon } from "@roninoss/icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function Tab() {
  const { theme } = useUnistyles();
  const privacySheetRef = useRef<any>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteQuizResults } = useDeleteQuizResults();
  const analytics = useAnalytics();

  const handleRepeatEvaluation = async () => {
    Alert.alert(
      "Repetir Evaluación",
      "¿Estás seguro de querer repetir la evaluación? Esta acción borrará tus resultados actuales.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Repetir",
          onPress: async () => {
            await deleteQuizResults();
            await cleanupQuizData(queryClient);
            analytics.quizResultsDeleted();
            router.push("/(app)");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        onPress={() => router.push("/profile/account")}
        style={{
          // backgroundColor: theme.colors.surface,
          padding: theme.gap(1),
          borderRadius: theme.radius.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.gap(1),
        }}
      >
        <Icon
          name="person.circle.fill"
          size={24}
          namingScheme="sfSymbol"
          color={theme.colors.dimmed}
        />
        <Heading level={5} style={{ flex: 1 }}>
          Configuración de la cuenta
        </Heading>
        <Icon
          name="chevron.right"
          size={20}
          namingScheme="sfSymbol"
          color={theme.colors.dimmed}
        />
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity
        onPress={() => {
          privacySheetRef.current?.present();
        }}
        style={{
          padding: theme.gap(1),
          borderRadius: theme.radius.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.gap(1),
        }}
      >
        <Icon
          name="lock.shield.fill"
          size={24}
          namingScheme="sfSymbol"
          color={theme.colors.dimmed}
        />
        <Heading level={5} style={{ flex: 1 }}>
          Política de Privacidad
        </Heading>
        <Icon
          name="chevron.right"
          size={20}
          namingScheme="sfSymbol"
          color={theme.colors.dimmed}
        />
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity
        onPress={handleRepeatEvaluation}
        activeOpacity={0.8}
        style={{
          // backgroundColor: theme.colors.surface,
          padding: theme.gap(1),
          borderRadius: theme.radius.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.gap(1),
        }}
      >
        <Icon
          name="repeat"
          size={24}
          namingScheme="sfSymbol"
          color={theme.colors.dimmed}
        />
        <Heading level={5} style={{ flex: 1 }}>
          Repetir Evaluación
        </Heading>
      </TouchableOpacity>
      <Divider />
      <SignOutButton />

      <PrivacyPolicySheet ref={privacySheetRef} />
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.gap(2),
    flex: 1,
  },
}));
