import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterBar } from "../components/FilterBar";
import { TaskInput } from "../components/TaskInput";
import { TaskItem } from "../components/TaskItem";
import { colors } from "../constants/colors";
import { Task, TaskFilter } from "../types/task";
import { loadTasks, saveTasks } from "../utils/storage";

/**
 * HomeScreen - PocketTasks
 * 
 * Manages application state, persistence lifecycle, and user interactions.
 */
export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);

  /**
   * Application Startup Lifecycle:
   * Load saved tasks from AsyncStorage on initial mount.
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
   * Persistence Lifecycle:
   * Save updated tasks collection whenever `tasks` changes.
   * Guard: Never save before the initial load has completed (prevents overwriting with []).
   */
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  /**
   * Adds a new task to the top of the collection using an immutable update.
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
   * Toggles the completion status of a task by ID using immutable map().
   */
  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Removes a task from state by ID using immutable filter().
   */
  const deleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  /**
   * Derived state: Calculate filtered tasks on-the-fly without duplicating state.
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
   * Derived state: Calculate task counts for filter badges.
   */
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
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
            <Text style={styles.greeting}>Good day 👋</Text>
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

          {/* Task List Section */}
          <View style={styles.listContainer}>
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
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});
