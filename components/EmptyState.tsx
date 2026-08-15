import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { TaskFilter } from "../types/task";

type EmptyStateProps = {
  filter: TaskFilter;
};

type EmptyContent = {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
};

const EMPTY_CONTENT_MAP: Record<TaskFilter, EmptyContent> = {
  all: {
    icon: "✓",
    iconBgColor: colors.primaryLight,
    iconColor: colors.primary,
    title: "No tasks yet",
    subtitle: "Create your first task above to get started.",
  },
  active: {
    icon: "★",
    iconBgColor: colors.successLight,
    iconColor: colors.success,
    title: "You're all caught up",
    subtitle: "You have no active tasks. Nice work!",
  },
  completed: {
    icon: "✓",
    iconBgColor: colors.surfaceHighlight,
    iconColor: colors.muted,
    title: "No completed tasks",
    subtitle: "Complete a task and it will appear here.",
  },
};

/**
 * EmptyState Component
 * 
 * Displays an encouraging, contextual message when the active task list is empty.
 */
export function EmptyState({ filter }: EmptyStateProps) {
  const content = EMPTY_CONTENT_MAP[filter];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: content.iconBgColor },
        ]}
      >
        <Text style={[styles.icon, { color: content.iconColor }]}>
          {content.icon}
        </Text>
      </View>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
});
