import type { Career } from "@/api/career";
import { Icon } from "@roninoss/icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function CareerListItem({
  item,
  isFirst,
  isLast,
}: {
  item: Career;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <Link
      href={{
        pathname: "/(app)/(tabs)/careers/[id]",
        params: {
          id: item._id,
          title: item.name,
          description: item.description,
          duration: item.duration.toString(),
          employability: item.employability,
          faculty: item.faculty,
        },
      }}
      asChild
      style={[
        styles.careerItem,
        isFirst && styles.careerItemFirst,
        isLast && styles.careerItemLast,
      ]}
    >
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.careerContent}>
          <Text style={styles.careerTitle}>{item.name}</Text>
          <Text style={styles.careerFaculty}>{item.faculty}</Text>
        </View>
        <Icon
          name="chevron.right"
          size={16}
          color={theme.colors.label}
          namingScheme="sfSymbol"
        />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create(theme => ({
  careerItem: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1.5),
    borderColor: theme.colors.borderSubtle,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0,
    marginHorizontal: 0,
  },
  careerItemFirst: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  careerItemLast: {
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderBottomWidth: 0.5,
  },
  careerContent: {
    flex: 1,
  },
  careerTitle: {
    fontSize: 15,
    fontFamily: "InstrumentSans_600SemiBold",
    color: theme.colors.textPrimary,
    marginBottom: theme.gap(0.25),
  },
  careerFaculty: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: theme.colors.dimmed,
    marginBottom: theme.gap(0.5),
  },
}));
