import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/task";

const TASKS_STORAGE_KEY = "@pockettasks/tasks";

/**
 * Storage Utility Layer
 * 
 * Encapsulates all direct communication with AsyncStorage.
 * Handles serialization (JSON.stringify), deserialization (JSON.parse),
 * safe fallbacks, and error boundaries.
 */

/**
 * Loads tasks from AsyncStorage.
 * Returns an empty array if no tasks are saved or if an error occurs.
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        return parsed as Task[];
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to load tasks from AsyncStorage:", error);
    return [];
  }
}

/**
 * Persists tasks array into AsyncStorage as a JSON string.
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Failed to save tasks to AsyncStorage:", error);
  }
}
