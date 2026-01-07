import { cleanupAuthData } from "@/utils/auth-cleanup";
import { useClerk } from "@clerk/clerk-expo";
import { Icon } from "@roninoss/icons";
import { useQueryClient } from "@tanstack/react-query";
import { TouchableOpacity, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import Heading from "../ui/heading";

export default function SignOutButton() {
  const { signOut } = useClerk();
  const { theme } = useUnistyles();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      // Clean up all local data first
      await cleanupAuthData(queryClient);
      
      // Then sign out from Clerk
      await signOut();
      
      // Navigation will happen automatically via the auth guard in _layout.tsx
    } catch (err) {
      console.error("Error during sign out:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      style={{
        padding: theme.gap(1),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.gap(1),
      }}
      activeOpacity={0.8}
    >
      <Icon
        name="rectangle.portrait.and.arrow.right.fill"
        size={24}
        namingScheme="sfSymbol"
        color={theme.colors.dimmed}
      />
      <Heading level={5} style={{ flex: 1 }}>
        Cerrar sesión
      </Heading>
      <View />
    </TouchableOpacity>
  );
}
