import Input from "@/components/ui/input";
import { Icon } from "@roninoss/icons";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  canSend: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  canSend,
  placeholder = "Pregúntame sobre carreras, experiencias o cualquier cosa…",
}: ChatInputProps) {
  const progress = useDerivedValue(() =>
    withTiming(canSend ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    })
  );

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${-90 * progress.value}deg` }],
    };
  });

  return (
    <View style={styles.inputBar}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType="send"
        onSubmitEditing={onSend}
        style={styles.inputContainer}
      />
      <Pressable
        onPress={onSend}
        style={[styles.sendButton, { opacity: canSend ? 1 : 0.5 }]}
        disabled={!canSend}
      >
        <Animated.View style={iconAnimatedStyle}>
          <Icon
            name="arrow.right"
            namingScheme="sfSymbol"
            size={20}
            color={"black"}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(2),
    paddingVertical: theme.gap(2),
    paddingHorizontal: theme.gap(1),
  },
  inputContainer: {
    flex: 1,
  },
  sendButton: {
    padding: theme.gap(1),
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.tint,
  },
}));
