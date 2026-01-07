import Heading from "@/components/ui/heading";
import { useScreenTimer } from "@/hooks/use-screen-timer";
import { Icon } from "@roninoss/icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function HomeLayout() {
  const { theme } = useUnistyles();
  useScreenTimer("careers");

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShadowVisible: false,
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 26,
            fontFamily: "InstrumentSans_600SemiBold",
          },

          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(app)/(tabs)/careers/search")}
              style={styles.headerRightContainer}
            >
              <Heading level={6}>Ver todas</Heading>
              <Icon
                name="magnifyingglass"
                size={18}
                namingScheme="sfSymbol"
                color={theme.colors.textSecondary}
              />
            </Pressable>
          ),
          headerTitle: "Carreras",
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerTitle: "",

          // headerSearchBarOptions: {
          //   // autoFocus: true,
          //   // placeholder: "Buscar carreras o habilidades...",
          //   // hideWhenScrolling: true,
          //   // obscureBackground: true,
          //   // autoCapitalize: "none",
          // },
        }}
      />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="curriculum" />
      <Stack.Screen name="similar" />
    </Stack>
  );
}

const styles = StyleSheet.create(theme => ({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.5),
  },
  headerRightText: {
    fontSize: 14,
    fontFamily: "InstrumentSans_400Regular",
    color: theme.colors.textSecondary,
  },
}));
