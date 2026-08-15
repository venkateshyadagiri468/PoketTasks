import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * RootLayout
 * 
 * Configures the root navigation stack for PocketTasks.
 * Disables default navigation headers so the Home screen can render its custom header.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8FAFC" },
          animation: "fade",
        }}
      />
    </SafeAreaProvider>
  );
}
