import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * TaskItem Component
 * 
 * Renders an individual task row with:
 * 1. A circular toggle indicator (checkbox)
 * 2. The task title (with strikethrough when completed)
 * 3. A delete button
 */
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <View
      style={[
        styles.card,
        task.completed && styles.cardCompleted,
      ]}
    >
      {/* Completion Toggle Button */}
      <Pressable
        style={({ pressed }) => [
          styles.checkbox,
          task.completed && styles.checkboxCompleted,
          pressed && styles.checkboxPressed,
        ]}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={
          task.completed
            ? `Mark "${task.title}" as incomplete`
            : `Mark "${task.title}" as complete`
        }
        hitSlop={8}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      {/* Task Title (Tappable to toggle) */}
      <Pressable
        style={styles.titleContainer}
        onPress={() => onToggle(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Task: ${task.title}`}
      >
        <Text
          style={[
            styles.title,
            task.completed && styles.titleCompleted,
          ]}
        >
          {task.title}
        </Text>
      </Pressable>

      {/* Delete Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
        onPress={() => onDelete(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete task "${task.title}"`}
        hitSlop={8}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardCompleted: {
    backgroundColor: "#F8FAFC",
    borderColor: colors.border,
    opacity: 0.85,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxPressed: {
    transform: [{ scale: 0.92 }],
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    fontWeight: "500",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: colors.muted,
    fontWeight: "400",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonPressed: {
    backgroundColor: colors.dangerLight,
  },
  deleteIcon: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: "600",
  },
});
