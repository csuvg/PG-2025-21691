import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { BlurView, type BlurTint } from "expo-blur";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet as RNStyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";

const UBlurView = withUnistyles(BlurView, (theme, rt) => ({
  tint: (rt.colorScheme === "dark" ? "dark" : "light") as BlurTint,
}));

export default function IntroModal({
  visible,
  title,
  body,
  onClose,
  minReadMs = 1000,
  primaryActionText = "Entendido",
}: {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
  minReadMs?: number;
  primaryActionText?: string;
}) {
  const { theme } = useUnistyles();
  const [showButton, setShowButton] = useState(false);
  const buttonOpacity = useSharedValue(0.5);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (visible) {
      buttonOpacity.value = 0.5;
      setShowButton(false);
      timer = setTimeout(
        () => {
          setShowButton(true);
          buttonOpacity.value = withTiming(1, { duration: 200 });
        },
        Math.max(0, minReadMs)
      );
    } else {
      buttonOpacity.value = 0;
      setShowButton(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, minReadMs, buttonOpacity]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    pointerEvents:
      buttonOpacity.value >= 1 ? ("auto" as const) : ("none" as const),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (showButton) onClose();
      }}
    >
      <View style={styles.backdrop}>
        <UBlurView intensity={15} style={styles.blur} />
        <View style={styles.overlay} />
        <Animated.View
          style={styles.card}
          entering={FadeInUp.springify(500).withInitialValues({ opacity: 0 })}
        >
          <View style={{ gap: theme.gap(1.25) }}>
            <Animated.View entering={FadeIn.delay(0).duration(1000)}>
              <Heading style={{ textAlign: "left" }} level={2}>
                {title}
              </Heading>
            </Animated.View>
            <Animated.View entering={FadeIn.delay(200).duration(1000)}>
              <Paragraph color="secondary" style={{ textAlign: "left" }}>
                {body}
              </Paragraph>
            </Animated.View>
          </View>
          <Animated.View style={buttonAnimatedStyle}>
            <Button title={primaryActionText} onPress={onClose} />
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create(theme => ({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.gap(2),
  },
  blur: {
    ...RNStyleSheet.absoluteFillObject,
  },
  overlay: {
    ...RNStyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: theme.colors.surface,
    padding: theme.gap(2),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.gap(2),
    zIndex: 1,
  },
}));
