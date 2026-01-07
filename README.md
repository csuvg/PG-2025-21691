# PG-2025-21691

Proyecto de Graduación 2025 - Carnet: 21691

## Descripción del Proyecto

Mirai es una aplicación móvil multiplataforma diseñada para transformar la orientación vocacional en Guatemala. Ante la falta de herramientas personalizadas y la alta deserción universitaria, esta solución ofrece acompañamiento continuo a estudiantes de diversificado mediante un sistema de recomendación basado en inteligencia artificial y modelos psicométricos (RIASEC, Big Five, Grit).

La aplicación integra diagnósticos iniciales, exploración guiada de carreras con información curricular y un asistente conversacional contextual. A través de una interfaz intuitiva y optimizada, Mirai busca empoderar a los estudiantes para tomar decisiones académicas informadas, combinando principios de psicometría e Interacción Humano-Computadora (HCI) en una experiencia fluida y accesible.

## Tecnologías Utilizadas

El proyecto utiliza un stack moderno basado en React Native y Expo:

- **Framework Principal:** [React Native](https://reactnative.dev/) con [Expo SDK 52](https://expo.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Navegación:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Estilos:** [React Native Unistyles](https://reactnativeunistyles.vercel.app/) y [Expo Google Fonts](https://github.com/expo/google-fonts)
- **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand) y [TanStack Query](https://tanstack.com/query/latest)
- **Autenticación:** [Clerk](https://clerk.com/)
- **Analíticas:** [PostHog](https://posthog.com/)
- **Componentes UI:** `@roninoss/icons`, `sonner-native`, `react-native-gesture-handler`, `react-native-reanimated`

## Requisitos Previos

Este proyecto utiliza **Development Builds** debido a dependencias nativas personalizadas, por lo que **no funciona directamente en Expo Go**. Necesitas configurar el entorno de desarrollo nativo localmente.

> 📘 **Guía Oficial:** Para instrucciones detalladas paso a paso sobre cómo configurar tu entorno (Android Studio, Xcode, etc.), consulta la guía: [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/).

- [Node.js](https://nodejs.org/) (Versión LTS recomendada)
- **Para Android:**
  - [Android Studio](https://developer.android.com/studio)
  - Android SDK y Java Development Kit (JDK) configurados
- **Para iOS** (Solo macOS):
  - [Xcode](https://developer.apple.com/xcode/)
  - CocoaPods (`sudo gem install cocoapods`)

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/csuvg/PG-2025-21691
   cd src
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

## Ejecución

Para ejecutar la aplicación, debes compilar la versión nativa localmente (Development Build).

> 📖 **Documentación:** Si tienes problemas o quieres saber más sobre este proceso, revisa: [Compiling locally](https://docs.expo.dev/guides/local-app-development/#local-app-compilation).

### Android

1. Conecta tu dispositivo Android o inicia un emulador.
2. Ejecuta el comando de compilación:
   ```bash
   npx expo run:android
   ```

### iOS (Solo macOS)

1. Inicia el simulador de iOS.
2. Ejecuta el comando de compilación:
   ```bash
   npx expo run:ios
   ```

> **Nota:** Una vez que la aplicación (Development Build) esté instalada en tu dispositivo o emulador, puedes iniciar el servidor de desarrollo simplemente con `npx expo start` en futuras sesiones, siempre que no hayas cambiado código nativo.

## Recursos Adicionales

- **Video Demo:** [Ver demostración](/demo/demo.mp4)
- **Informe Final:** [Leer informe completo](/docs/informe_final.pdf)

## Autor

- **Nombre:** Adrian Rodríguez
- **Carnet:** 21691
