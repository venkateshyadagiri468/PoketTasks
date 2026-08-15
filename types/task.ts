/**
 * PocketTasks - Type Definitions
 * 
 * Defines the core data models used throughout the application.
 */

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601 string representation of task creation date
};

export type TaskFilter = "all" | "active" | "completed";
