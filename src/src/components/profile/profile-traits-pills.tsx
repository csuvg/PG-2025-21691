import type { TraitScores } from "@/api/career";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import Spacer from "@/components/ui/spacer";
import {
  mapTraitScoresToPills,
  type TraitPillItem,
} from "@/utils/result-interpretation";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Icon } from "@roninoss/icons";
import { useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ProfileTraitsPillsProps = {
  traitScores: TraitScores;
  style?: any;
};

export default function ProfileTraitsPills({
  traitScores,
  style,
}: ProfileTraitsPillsProps) {
  const { theme } = useUnistyles();
  const items = useMemo<TraitPillItem[]>(
    () => mapTraitScoresToPills(traitScores),
    [traitScores]
  );
  const [active, setActive] = useState<TraitPillItem | null>(null);
  const sheetRef = useRef<any>(null);

  const open = async () => {
    try {
      await sheetRef.current?.present();
    } catch (err) {
      console.warn("present failed", err);
    }
  };

  const close = async () => {
    try {
      await sheetRef.current?.dismiss();
      setActive(null);
    } catch (err) {
      console.warn("dismiss failed", err);
    }
  };

  const handlePress = (item: TraitPillItem) => {
    setActive(item);
    open();
  };

  return (
    <View style={style}>
      <View style={styles.pillsRow}>
        {items.map(item => (
          <Pressable
            key={item.id}
            style={[
              styles.pill,
              {
                // borderColor: item.accentColor,
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => handlePress(item)}
            accessibilityRole="button"
          >
            <View
              style={[styles.iconWrap, { backgroundColor: item.accentColor }]}
            >
              <Icon
                name={item.icon as any}
                namingScheme="sfSymbol"
                size={14}
                color={theme.colors.background}
              />
            </View>
            <View style={styles.textWrap}>
              <Paragraph
                size="xs"
                style={{ fontFamily: "InstrumentSans_500Medium" }}
                color="secondary"
                numberOfLines={1}
              >
                {item.title}
              </Paragraph>
              {/* {item.subtitle ? (
                <Paragraph
                  size="xs"
                  color="tertiary"
                  style={{ marginTop: theme.gap(-1) }}
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Paragraph>
              ) : null} */}
            </View>
          </Pressable>
        ))}
      </View>

      {/* Details Sheet */}
      <TrueSheet
        ref={sheetRef}
        style={styles.sheet}
        sizes={["auto"]}
        cornerRadius={16}
        backgroundColor={theme.colors.surface}
        dimmed={true}
      >
        <View style={styles.sheetContent}>
          {active && (
            <>
              {/* <Pressable onPress={() => close()} style={styles.closeButton}>
                <Icon
                  name="xmark"
                  size={16}
                  color={theme.colors.textPrimary}
                  namingScheme="sfSymbol"
                />
              </Pressable> */}
              <View style={styles.sheetHeader}>
                <View
                  style={[
                    styles.sheetIconWrap,
                    { backgroundColor: active.accentColor },
                  ]}
                >
                  <Icon
                    name={active.icon as any}
                    namingScheme="sfSymbol"
                    size={28}
                    color={theme.colors.background}
                  />
                </View>
                <Spacer />
                <Heading
                  level={4}
                  style={{
                    textAlign: "center",
                    letterSpacing: -0.35,
                  }}
                >
                  {active.title}
                </Heading>
                <Spacer />
                <Paragraph
                  style={{
                    textAlign: "center",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {active.detail}
                </Paragraph>
              </View>
            </>
          )}
        </View>
      </TrueSheet>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  headerRow: {
    marginBottom: theme.gap(1.75),
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.gap(0.75),
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.75),
    paddingHorizontal: theme.gap(0.7),
    paddingVertical: theme.gap(0.65),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    maxWidth: 160,
    marginRight: theme.gap(0.5),
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderBottomWidth: 0,
    flex: 1,
  },
  sheetContent: {
    paddingBottom: theme.gap(6),
    paddingTop: theme.gap(2),
    paddingHorizontal: theme.gap(2),
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  sheetHeader: {
    alignItems: "center",
    paddingTop: theme.gap(2),
  },
  sheetIconWrap: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.gap(1),
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 1,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.gap(1),
    borderRadius: theme.radius.full,
  },
}));
