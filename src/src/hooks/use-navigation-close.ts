import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";

/**
 * Hook to detect when a screen is closing during navigation transition.
 * Useful for handling cleanup or hiding elements during back transitions.
 *
 * @param navigation - The navigation object from useNavigation
 * @param onClose - Callback function to run when the screen is closing
 */
export function useNavigationClose(
  navigation: NativeStackNavigationProp<any>,
  onClose: () => void
) {
  useEffect(() => {
    const subStart = navigation.addListener("transitionStart", (e: any) => {
      // If this screen is closing (pop / goBack)
      if (e.data?.closing) {
        onClose();
      }
    });

    const subEnd = navigation.addListener("transitionEnd", (e: any) => {
      if (e.data?.closing) {
        onClose();
      }
    });

    return () => {
      subStart();
      subEnd();
    };
  }, [navigation, onClose]);
}
