import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ChoiceRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  accent: string;
}

export default function ChoiceRow({
  label,
  selected,
  onPress,
  accent,
}: ChoiceRowProps) {
  const { theme } = useUnistyles();

  const selectedValue = useSharedValue(selected);

  useEffect(() => {
    selectedValue.value = selected;
  }, [selected]);

  const bulletAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(selectedValue.value ? 1 : 0, { duration: 500 }),
      transform: [
        { scale: withSpring(selectedValue.value ? 1 : 0.5, { duration: 500 }) },
      ],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        { borderColor: selected ? accent : theme.colors.borderSubtle },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View
        style={[
          styles.bullet,
          {
            borderColor: selected ? accent : theme.colors.borderSubtle,
          },
        ]}
      >
        {selected && (
          <Animated.View
            style={[
              styles.bulletInner,
              {
                backgroundColor: accent,
              },
              bulletAnimatedStyles,
            ]}
          >
            <View />
          </Animated.View>
        )}
      </View>
      <Text style={styles.choiceText} numberOfLines={0}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1.5),
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1.25),
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    backgroundColor: theme.colors.background,
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bulletInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  choiceText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap",
    color: theme.colors.textPrimary,
  },
}));
