import Button from "@/components/ui/button";
import FormInput, { FormGroup } from "@/components/ui/form-input";
import Heading from "@/components/ui/heading";
import Input from "@/components/ui/input";
import Paragraph from "@/components/ui/paragraph";
import Spacer from "@/components/ui/spacer";
import { cleanupAuthData } from "@/utils/auth-cleanup";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView, type BlurTint } from "expo-blur";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet as RNStyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";

const UBlurView = withUnistyles(BlurView, (theme, rt) => ({
  tint: (rt.colorScheme === "dark" ? "dark" : "light") as BlurTint,
}));

export default function Account() {
  const { theme } = useUnistyles();
  const { user } = useUser();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  let name = user?.fullName || "";
  let email = user!.emailAddresses[0].emailAddress;

  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingName, setPendingName] = useState(name);
  const [savingName, setSavingName] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleSaveName() {
    if (!user) return;
    const trimmed = pendingName.trim();
    if (trimmed.length === 0) return;
    const [firstName, ...rest] = trimmed.split(" ");
    const lastName = rest.join(" ");
    try {
      setSavingName(true);
      await user.update({ firstName, lastName });
      setShowNameModal(false);
    } catch (e) {
      Alert.alert("No se pudo guardar", "Intenta nuevamente.");
    } finally {
      setSavingName(false);
    }
  }

  function confirmDeleteAccount() {
    setShowDeleteModal(true);
  }
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: theme.gap(1) }}>
        <Text
          style={{
            fontSize: 14,
            marginLeft: theme.gap(1),
            color: theme.colors.label,
            fontFamily: "Inter_400Regular",
          }}
        >
          Información Básica
        </Text>
      </View>
      <FormGroup>
        <FormInput
          label="Nombre"
          placeholder=""
          onPress={() => {
            setPendingName(name);
            setShowNameModal(true);
          }}
          value={name || ""}
        />
        <FormInput
          label="Correo"
          placeholder="Tu correo"
          onPress={() => {}}
          value={email}
          disabled
          right={null}
        />
      </FormGroup>
      <Spacer />
      <FormInput
        label="Eliminar cuenta"
        placeholder=""
        onPress={confirmDeleteAccount}
        value={""}
        right={null}
        labelStyle={{ color: theme.colors.danger }}
      />

      {/* Edit Name Modal */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <View style={styles.backdrop}>
          <UBlurView intensity={15} style={styles.blur} />
          <View style={styles.overlay} />
          <Animated.View
            style={styles.modalCard}
            entering={FadeInUp.springify(500).withInitialValues({ opacity: 0 })}
          >
            <Heading level={3} style={{ alignSelf: "flex-start" }}>
              Actualizar nombre
            </Heading>
            <Input
              placeholder="Nombre y apellido"
              value={pendingName}
              style={{ width: "100%" }}
              onChangeText={setPendingName}
            />
            <Button
              title={savingName ? "Guardando…" : "Guardar"}
              onPress={handleSaveName}
              disabled={savingName}
              style={{ width: "100%" }}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!deletingAccount) {
            setShowDeleteModal(false);
            setDeletingAccount(false);
          }
        }}
      >
        <View style={styles.backdrop}>
          <UBlurView intensity={15} style={styles.blur} />
          <View style={styles.overlay} />
          <Animated.View
            style={styles.modalCard}
            entering={FadeInUp.springify(500).withInitialValues({ opacity: 0 })}
          >
            <View style={{ gap: theme.gap(1) }}>
              <Heading level={2}>¿Eliminar cuenta?</Heading>
              <Paragraph>
                Esta acción borrará tu perfil, tus respuestas y todo el progreso
                guardado en la aplicación.
              </Paragraph>
              <Paragraph style={{ fontFamily: "Inter_600SemiBold" }}>
                No podrás deshacer este cambio.
              </Paragraph>
            </View>
            <View style={{ gap: theme.gap(1), width: "100%" }}>
              <Button
                title={deletingAccount ? "Eliminando…" : "Borrar"}
                variant="destructive"
                disabled={deletingAccount}
                onPress={async () => {
                  console.log("deleting account");
                  try {
                    setDeletingAccount(true);
                    // Cancel any in-flight queries to avoid races during deletion
                    await queryClient.cancelQueries();
                    // Delete the Clerk account first (triggers server-side webhooks)
                    await user?.delete();
                    // Ensure local Clerk session is terminated
                    await signOut();
                    // Now clean up local app data and caches
                    await cleanupAuthData(queryClient);

                    // Close delete modal
                    setShowDeleteModal(false);

                    // Navigation will happen automatically via the auth guard in _layout.tsx
                  } catch (e) {
                    console.error("Error during account deletion:", e);
                    Alert.alert("No se pudo eliminar", "Intenta nuevamente.");
                    setDeletingAccount(false);
                  }
                }}
              />
              <Button
                variant="outline"
                title="Cancelar"
                disabled={deletingAccount}
                onPress={() => {
                  console.log("cancelling delete");
                  setShowDeleteModal(false);
                  setDeletingAccount(false);
                }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Email change intentionally disabled */}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.gap(2),
    flex: 1,
  },
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
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: theme.colors.surface,
    padding: theme.gap(2),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.gap(2.5),
    zIndex: 1,
  },
}));
