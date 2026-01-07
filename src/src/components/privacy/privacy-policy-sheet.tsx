import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import type { Component } from "react";
import { forwardRef, useRef } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const PrivacyPolicySheet = forwardRef<any>((props, ref) => {
  const { theme } = useUnistyles();
  const scrollRef = useRef<ScrollView>(null);
  return (
    <TrueSheet
      ref={ref}
      scrollRef={
        Platform.OS === "ios"
          ? (scrollRef as unknown as React.RefObject<
              Component<unknown, {}, any>
            >)
          : undefined
      }
      sizes={["medium"]}
      cornerRadius={16}
      backgroundColor={theme.colors.surface}
      dimmed
      style={styles.sheet}
    >
      <View style={styles.sheetContainer}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          bounces={Platform.OS === "ios"}
          scrollEnabled={true}
        >
          <View style={styles.section}>
            <Heading level={2} style={styles.title}>
              Política de Privacidad
            </Heading>
            <Heading level={4}>1. Responsable del tratamiento</Heading>
            <Paragraph>
              Esta aplicación es desarrollada y mantenida por Mirai Vocational
              App, proyecto académico de la Universidad del Valle de Guatemala.
            </Paragraph>
            <Paragraph style={styles.contact}>
              Contacto: soporte@mirai.app
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>2. Datos recopilados</Heading>
            <Paragraph>
              La aplicación recopila únicamente la información mínima necesaria
              para su funcionamiento:
            </Paragraph>

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  <Text style={styles.bold}>Datos de cuenta:</Text> correo
                  electrónico (en caso de autenticación), nombre opcional y
                  proveedor de acceso (Google u otro).
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  <Text style={styles.bold}>Datos de uso:</Text> interacciones
                  dentro de la app (por ejemplo, tarjetas vistas o guardadas).
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  <Text style={styles.bold}>
                    Resultados del cuestionario vocacional:
                  </Text>{" "}
                  respuestas y resultados psicométricos almacenados localmente
                  en el dispositivo.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  <Text style={styles.bold}>Datos técnicos básicos:</Text>{" "}
                  versión del sistema operativo y modelo de dispositivo,
                  utilizados de forma agregada para análisis de rendimiento.
                </Paragraph>
              </View>
            </View>

            <Paragraph>
              No se solicitan ni almacenan datos sensibles, financieros o de
              localización.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>3. Finalidad del tratamiento</Heading>
            <Paragraph>Los datos se utilizan exclusivamente para:</Paragraph>

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Personalizar las recomendaciones de carreras dentro de la
                  aplicación.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Analizar de forma anónima el uso general (frecuencia,
                  pantallas más visitadas, errores).
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Mejorar la estabilidad y la experiencia del usuario.
                </Paragraph>
              </View>
            </View>

            <Paragraph>
              No se utilizan los datos para publicidad, marketing ni se
              transfieren a terceros con fines comerciales.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>4. Base legal y consentimiento</Heading>
            <Paragraph>
              El uso de la aplicación implica la aceptación de esta política.
              Antes de crear una cuenta o iniciar sesión, se solicita el
              consentimiento expreso mediante una casilla de verificación
              obligatoria.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>5. Almacenamiento y seguridad</Heading>

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  La autenticación se gestiona mediante Clerk, proveedor
                  certificado que cumple con estándares internacionales de
                  seguridad.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Las conversaciones del chat y los resultados del quiz se
                  guardan únicamente en el dispositivo del usuario.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Las comunicaciones entre el cliente y los servicios en la nube
                  se realizan bajo HTTPS y cifrado de extremo a extremo.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  No se almacenan contraseñas ni tokens sin cifrar.
                </Paragraph>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Heading level={4}>6. Analítica y cookies</Heading>
            <Paragraph>
              Se emplean métricas anónimas para comprender el uso general de la
              aplicación (por ejemplo, número de sesiones o tiempo promedio de
              uso). No se utilizan cookies publicitarias ni identificadores
              personales.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>7. Derechos del usuario</Heading>
            <Paragraph>El usuario puede en cualquier momento:</Paragraph>

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Consultar o eliminar sus resultados del quiz.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Eliminar su cuenta y todos sus datos asociados desde el módulo
                  Perfil.
                </Paragraph>
              </View>

              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Paragraph style={styles.listText}>
                  Solicitar asistencia o eliminación completa escribiendo a
                  soporte@mirai.app
                </Paragraph>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Heading level={4}>8. Uso por menores de edad</Heading>
            <Paragraph>
              La aplicación está dirigida a estudiantes de nivel diversificado
              (≈15–19 años). No se recopilan datos de identificación personal
              más allá del correo electrónico necesario para autenticación. Si
              el usuario es menor de edad, se recomienda el uso bajo supervisión
              del centro educativo o tutor legal.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>9. Conservación de datos</Heading>
            <Paragraph>
              Los datos se conservan solo mientras la cuenta esté activa. Si el
              usuario elimina su perfil o permanece inactivo por más de doce
              meses, la información se elimina de forma automática.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>10. Cambios en la política</Heading>
            <Paragraph>
              Esta política puede actualizarse para reflejar mejoras o cambios
              técnicos. Las modificaciones relevantes se notificarán dentro de
              la aplicación antes de su entrada en vigor.
            </Paragraph>
          </View>

          <View style={styles.section}>
            <Heading level={4}>11. Contacto</Heading>
            <Paragraph>
              Para cualquier solicitud relacionada con la privacidad o el manejo
              de datos personales, puede escribirse a:
            </Paragraph>
            <Paragraph style={styles.contact}>📧 soporte@mirai.app</Paragraph>
          </View>

          <View style={styles.footer}>
            <Paragraph style={styles.footerText}>
              Última actualización: Octubre 2025
            </Paragraph>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Cerrar"
            variant="secondary"
            onPress={() => {
              // @ts-expect-error - ref types
              ref?.current?.dismiss();
            }}
            style={{ width: "100%" }}
          />
        </View>
      </View>
    </TrueSheet>
  );
});

PrivacyPolicySheet.displayName = "PrivacyPolicySheet";

export default PrivacyPolicySheet;

const styles = StyleSheet.create(theme => ({
  sheet: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderBottomWidth: 0,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    minHeight: 0,
  },
  title: {
    textAlign: "left",
    paddingTop: theme.gap(4),
    paddingBottom: theme.gap(2),
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.gap(2),
    paddingTop: theme.gap(2),
    paddingBottom: theme.gap(2),
  },
  section: {
    marginBottom: theme.gap(2.5),
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  contact: {
    fontFamily: "Inter_600SemiBold",
    color: theme.colors.tint,
  },
  list: {
    marginVertical: theme.gap(1),
    gap: theme.gap(1.5),
  },
  listItem: {
    flexDirection: "row",
    gap: theme.gap(1),
  },
  bullet: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  listText: {
    flex: 1,
  },
  bold: {
    fontFamily: "Inter_600SemiBold",
    color: theme.colors.textPrimary,
  },
  footer: {
    marginTop: theme.gap(1),
    paddingTop: theme.gap(2),
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  buttonContainer: {
    padding: theme.gap(2),
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surface,
  },
}));
