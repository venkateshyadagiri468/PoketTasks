import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

/**
 * HomeScreen
 * 
 * The main screen of PocketTasks.
 * In Phase 2, we establish the clean layout container and the welcoming header.
 */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.subtitle}>Stay focused and get things done.</Text>
        </View>

        {/* Content Placeholder for subsequent phases */}
        <View style={styles.content}>
          <Text style={styles.placeholderText}>
            Task management interface will appear here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "400",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: colors.muted,
  },
});
