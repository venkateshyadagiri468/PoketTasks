import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskInput } from "../components/TaskInput";
import { TaskItem } from "../components/TaskItem";
import { colors } from "../constants/colors";
import { Task } from "../types/task";

/**
 * HomeScreen - PocketTasks
 * 
 * Manages task operations: creation, completion toggling, and deletion.
 */
export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

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

          {/* Task List Section */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionHeader}>
              Today's Tasks ({tasks.length})
            </Text>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
});
