import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { TaskFilter } from "../types/task";

type FilterBarProps = {
  filter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  counts?: {
    all: number;
    active: number;
    completed: number;
  };
};

type FilterOption = {
  id: TaskFilter;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

/**
 * FilterBar Component
 * 
 * Renders tab pills to filter tasks by "All", "Active", and "Completed".
 * The active tab is highlighted with the primary brand color.
 */
export function FilterBar({ filter, onChange, counts }: FilterBarProps) {
  return (
    <View style={styles.container}>
      {FILTER_OPTIONS.map((option) => {
        const isSelected = filter === option.id;
        const count = counts ? counts[option.id] : undefined;

        return (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.tab,
              isSelected ? styles.tabSelected : styles.tabUnselected,
              pressed && styles.tabPressed,
            ]}
            onPress={() => onChange(option.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.label} tasks filter${
              count !== undefined ? `, ${count} tasks` : ""
            }`}
          >
            <Text
              style={[
                styles.tabText,
                isSelected
                  ? styles.tabTextSelected
                  : styles.tabTextUnselected,
              ]}
            >
              {option.label}
            </Text>

            {count !== undefined && (
              <View
                style={[
                  styles.badge,
                  isSelected
                    ? styles.badgeSelected
                    : styles.badgeUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected
                      ? styles.badgeTextSelected
                      : styles.badgeTextUnselected,
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  tabPressed: {
    opacity: 0.85,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextSelected: {
    color: "#FFFFFF",
  },
  tabTextUnselected: {
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  badgeUnselected: {
    backgroundColor: colors.surfaceHighlight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeTextSelected: {
    color: "#FFFFFF",
  },
  badgeTextUnselected: {
    color: colors.muted,
  },
});
