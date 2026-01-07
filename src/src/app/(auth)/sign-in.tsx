import PrivacyPolicySheet from "@/components/privacy/privacy-policy-sheet";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Input from "@/components/ui/input";
import { isClerkAPIResponseError, useAuth, useSignIn } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { toast } from "sonner-native";

export default function SignIn() {
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const privacySheetRef = useRef<any>(null);

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

  const validate = () => {
    const nextErrors: {
      email?: string;
      password?: string;
    } = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      nextErrors.email = "Correo inválido";
    if (password.length < 6) nextErrors.password = "Mínimo 6 caracteres";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate() || !isLoaded) return;
    try {
      const attempt = await signIn.create({
        identifier: email,
        password,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/(app)");
      } else {
        console.log("Sign in requires more steps", attempt);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        // Handle specific errors with user-friendly messages
        const error = err.errors[0];

        switch (error.code) {
          case "form_password_incorrect":
            toast.error("Contraseña incorrecta. Inténtalo de nuevo.");
            break;
          case "form_identifier_not_found":
            toast.error("No encontramos una cuenta con este correo.");
            break;
          case "user_locked":
            toast.error("Cuenta bloqueada temporalmente.");
            break;
          case "form_identifier_exists":
            toast.error(
              "Esta cuenta existe pero no está verificada. Revisa tu correo."
            );
            break;
          default:
            toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
        }
      } else {
        toast.error("Error de conexión. Revisa tu internet.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { marginTop: -top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View>
            <Heading level={1}>Iniciar sesión</Heading>
          </View>

          <View style={styles.form}>
            <Input
              label="Correo"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={errors.email}
              ref={emailRef}
            />
            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              error={errors.password}
              ref={passwordRef}
            />
          </View>

          <Button
            title="Ingresar"
            onPress={onSubmit}
            rounded="lg"
            style={{ width: "100%" }}
          />

          <View style={styles.forgotPasswordContainer}>
            <Text
              style={styles.forgotPasswordLink}
              onPress={() => alert("Funcionalidad próximamente disponible")}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </View>

          <View style={styles.privacyContainer}>
            <Text
              style={styles.privacyLink}
              onPress={() => {
                privacySheetRef.current?.present();
              }}
            >
              Política de Privacidad
            </Text>
          </View>
        </View>
      </ScrollView>

      <PrivacyPolicySheet ref={privacySheetRef} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    maxWidth: 400,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: theme.gap(1.5),
    width: "100%",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    width: "100%",
    borderTopWidth: 0.5,
    paddingTop: theme.gap(2),
    borderTopColor: theme.colors.borderSubtle,
    marginTop: theme.gap(1),
  },
  forgotPasswordLink: {
    color: theme.colors.link,
    textDecorationLine: "underline",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  privacyContainer: {
    alignItems: "center",
    width: "100%",
  },
  privacyLink: {
    color: theme.colors.textSecondary,
    textDecorationLine: "underline",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
}));
