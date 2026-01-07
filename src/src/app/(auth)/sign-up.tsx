import PrivacyPolicySheet from "@/components/privacy/privacy-policy-sheet";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Heading from "@/components/ui/heading";
import Input from "@/components/ui/input";
import { isClerkAPIResponseError, useAuth, useSignUp } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
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

export default function SignUp() {
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const privacySheetRef = useRef<any>(null);

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    policy?: string;
  }>({});
  const [accepted, setAccepted] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

  const validate = () => {
    const nextErrors: {
      name?: string;
      email?: string;
      password?: string;
      policy?: string;
    } = {};
    if (!name.trim()) nextErrors.name = "Ingresa tu nombre";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      nextErrors.email = "Correo inválido";
    if (password.length < 6) nextErrors.password = "Mínimo 6 caracteres";
    if (!accepted) nextErrors.policy = "Acepta la política de privacidad";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate() || !isLoaded) return;
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.log("What the f*ck?", JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        const error = err.errors[0];

        switch (error.code) {
          case "form_identifier_exists":
            toast.error("Ya existe una cuenta con este correo.");
            break;
          case "form_password_pwned":
            toast.error("Esta contraseña es muy común. Usa una más segura.");
            break;
          case "form_password_validation_failed":
            toast.error("La contraseña no cumple los requisitos de seguridad.");
            break;
          default:
            toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
        }
      } else {
        toast.error("Error de conexión. Revisa tu internet.");
      }
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/(app)");
      } else {
        console.log("Verification requires more steps", attempt);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const error = err.errors[0];

        switch (error.code) {
          case "form_code_incorrect":
            toast.error("Código incorrecto. Verifica e inténtalo de nuevo.");
            break;
          case "verification_expired":
            toast.error("El código expiró. Solicita uno nuevo.");
            break;
          default:
            toast.error("Error de verificación. Inténtalo de nuevo.");
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
            <Heading level={1}>
              {pendingVerification ? "Verifica tu correo" : "Crear cuenta"}
            </Heading>
          </View>

          <View style={styles.form}>
            {pendingVerification ? (
              <Input
                label="Código de verificación"
                placeholder="Ingresa el código"
                value={code}
                onChangeText={setCode}
                returnKeyType="done"
                onSubmitEditing={onVerify}
              />
            ) : (
              <>
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  error={errors.name}
                />
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
                  autoComplete="password-new"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  error={errors.password}
                  ref={passwordRef}
                />

                <View style={{ marginTop: theme.gap(1) }}>
                  <Checkbox
                    value={accepted}
                    onValueChange={setAccepted}
                    label={
                      <>
                        Acepto la{" "}
                        <Text
                          style={styles.link}
                          onPress={() => privacySheetRef.current?.present()}
                        >
                          Política de Privacidad
                        </Text>
                      </>
                    }
                    error={errors.policy}
                  />
                </View>
              </>
            )}
          </View>

          {pendingVerification ? (
            <Button
              title="Verificar"
              onPress={onVerify}
              rounded="lg"
              style={{ width: "100%" }}
            />
          ) : (
            <Button
              title="Continuar"
              onPress={onSubmit}
              rounded="lg"
              style={{ width: "100%" }}
            />
          )}

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <Text style={styles.link}>Inicia sesión</Text>
            </Link>
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
    maxWidth: 400, // Limit width on larger screens
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: theme.gap(1.5),
    width: "100%",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.borderSubtle,
    paddingTop: theme.gap(2),
    width: "100%",
    justifyContent: "center",
    gap: theme.gap(0.5),
  },
  footerText: {
    color: theme.colors.dimmed,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  link: {
    color: theme.colors.link,
    textDecorationLine: "underline",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
}));
