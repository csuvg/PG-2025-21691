import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { Icon } from "@roninoss/icons";
import { View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface PreQuizScreenProps {
  onStart: () => void;
}

export default function PreQuizScreen({ onStart }: PreQuizScreenProps) {
  const { theme } = useUnistyles();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Main content */}
        <View style={styles.content}>
          <Animated.View
            entering={FadeIn.duration(1500)
              .delay(300)
              .withInitialValues({ opacity: 0 })}
          >
            <Heading level={1} style={{ textAlign: "left" }}>
              Bienvenido a Mirai
            </Heading>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(1000)
              .delay(500)
              .withInitialValues({ opacity: 0 })}
          >
            <Paragraph
              style={{
                color: theme.colors.textSecondary,
                textAlign: "justify",
                fontSize: 14,
              }}
            >
              Te ayudaremos a descubrir la mejor ruta de estudios para ti. Dicha
              prueba tomará 10–15 minutos, y evaluará lo siguiente:
            </Paragraph>
          </Animated.View>

          {/* What we evaluate */}
          <Animated.View
            entering={FadeIn.duration(800)
              .delay(700)
              .withInitialValues({ opacity: 0 })}
          >
            <View style={styles.evaluationList}>
              {[
                {
                  label: "Aptitudes",
                  description:
                    "Cómo resuelves problemas y entiendes información.",
                  icon: "lightbulb.fill",
                  color: theme.colors.accents.yellow,
                },
                {
                  label: "Intereses",
                  description: "Qué temas y actividades te motivan.",
                  icon: "person.circle",
                  color: theme.colors.accents.blue,
                },
                {
                  label: "Constancia",
                  description:
                    "Tu disciplina y perseverancia a lo largo del tiempo.",
                  icon: "clock",
                  color: theme.colors.accents.pink,
                },
              ].map((item, index) => (
                <Animated.View
                  key={index}
                  style={styles.featureItem}
                  entering={FadeInUp.withInitialValues({
                    transform: [{ translateY: 20 }],
                    opacity: 0,
                  })
                    .duration(1000)
                    .delay(700 + index * 200)}
                >
                  <View style={styles.iconContainer}>
                    <Icon
                      namingScheme="sfSymbol"
                      name={item.icon as any}
                      size={30}
                      color={item.color}
                      ios={{
                        renderingMode: "hierarchical",
                        colors: [item.color, item.color + "60"],
                      }}
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <Paragraph
                      style={[styles.featureTitle, { color: item.color }]}
                    >
                      {item.label}
                    </Paragraph>
                    <Paragraph style={styles.featureDescription}>
                      {item.description}
                    </Paragraph>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Pause tip - subtle */}
        <Animated.View
          entering={FadeIn.duration(1000).delay(1000)}
          style={styles.pauseTipContainer}
        >
          <Paragraph style={styles.pauseTipText}>
            Puedes pausar y continuar cuando quieras.
          </Paragraph>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeIn.duration(1000).delay(1000)}>
          <Button title="Comenzar" onPress={onStart} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1),
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.gap(1.5),
    paddingHorizontal: theme.gap(1),
  },
  evaluationList: {
    gap: theme.gap(2.5),
    marginTop: theme.gap(3),
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1.5),
  },
  iconContainer: {},
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 15,
    marginBottom: theme.gap(0.25),
  },
  featureDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  tipsList: {
    gap: theme.gap(1),
    marginTop: theme.gap(1),
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1.5),
    paddingHorizontal: theme.gap(1),
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  pauseTipContainer: {
    alignItems: "center",
    paddingHorizontal: theme.gap(2),
    marginBottom: theme.gap(1),
  },
  pauseTipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    opacity: 0.7,
  },
}));
