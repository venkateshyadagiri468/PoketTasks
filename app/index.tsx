import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FilterBar } from "../components/FilterBar";
import { TaskInput } from "../components/TaskInput";
import { TaskItem } from "../components/TaskItem";
import { colors } from "../constants/colors";
import { Task, TaskFilter } from "../types/task";
import { loadTasks, saveTasks } from "../utils/storage";

/**
 * Returns a friendly greeting based on the current hour of the day.
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning 👋";
  }
  if (hour < 17) {
    return "Good afternoon 👋";
  }
  return "Good evening 👋";
}

/**
 * HomeScreen - PocketTasks
 * 
 * The root screen coordinating UI, state, and local persistence.
 */
export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);

  /**
   * 1. App Startup:
   * Load saved tasks asynchronously from AsyncStorage on first mount.
   */
  useEffect(() => {
    let isMounted = true;

    async function initializeTasks() {
      const storedTasks = await loadTasks();
      if (isMounted) {
        setTasks(storedTasks);
        setLoading(false);
      }
    }

    initializeTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * 2. Auto-Persistence:
   * Save tasks whenever the collection updates.
   * Safety guard: only runs after the initial load completes.
   */
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  /**
   * Creates a new task and immutably prepends it to state.
   */
  const addTask = (title: string) => {
    const newTask: Task = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  };

  /**
   * Toggles task completion state immutably using Array.prototype.map().
   */
  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Deletes a task by ID immutably using Array.prototype.filter().
   */
  const deleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  /**
   * Derived State:
   * Filtered task list based on current active filter tab.
   */
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }
    if (filter === "completed") {
      return task.completed;
    }
    return true;
  });

  /**
   * Derived State:
   * Active and completed counts for header badges and filter pills.
   */
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const taskCounts = {
    all: tasks.length,
    active: activeCount,
    completed: completedCount,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              {tasks.length > 0 && (
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
                    {activeCount === 0
                      ? "All done!"
                      : `${activeCount} active`}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.subtitle}>
              Stay focused and get things done.
            </Text>
          </View>

          {/* Task Creation Input */}
          <TaskInput onAddTask={addTask} />

          {/* Filter Bar */}
          <FilterBar
            filter={filter}
            onChange={setFilter}
            counts={taskCounts}
          />

          {/* Task List / Loading / Empty State */}
          <View style={styles.listContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading your tasks...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TaskItem
                    task={item}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                )}
                ListEmptyComponent={<EmptyState filter={filter} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "400",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 28,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.muted,
  },
});
