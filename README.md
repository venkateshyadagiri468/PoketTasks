# PocketTasks 📱

> A clean, local-first personal task management application built with **React Native**, **Expo**, **TypeScript**, **Expo Router**, and **AsyncStorage**.

PocketTasks is designed both as a daily task manager and as a clear, educational reference for learning modern React Native architecture and patterns without confusing overengineering.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture & Data Flow](#project-architecture--data-flow)
- [Folder Structure](#folder-structure)
- [Getting Started & Running on Android](#getting-started--running-on-android)
- [How Local Storage Works](#how-local-storage-works)
- [Beginner's Guide to Core Concepts](#beginners-guide-to-core-concepts)
  - [1. React Concepts](#1-react-concepts)
  - [2. React Native Primitives](#2-react-native-primitives)
  - [3. Modern JavaScript Patterns](#3-modern-javascript-patterns)
  - [4. Mobile UX Principles](#4-mobile-ux-principles)
- [Key Architectural Decisions](#key-architectural-decisions)
- [Future Improvements (Version 2 Roadmap)](#future-improvements-version-2-roadmap)

---

## Features

- ⚡ **Local-First & Instant**: All data is stored directly on your Android device with zero cloud lag or accounts needed.
- ➕ **Task Creation**: Add tasks with instant auto-trimming validation and automatic keyboard dismissal.
- 🔄 **Completion Toggle**: Mark tasks as complete or active again with clear visual cues (strikethrough & opacity change).
- 🗑️ **Task Deletion**: Remove tasks instantly with a single tap.
- 🔍 **Derived Filtering**: Switch between **All**, **Active**, and **Completed** views with live count badges.
- 💾 **Safe Auto-Persistence**: Background synchronization via AsyncStorage with zero race conditions on app startup.
- 🎨 **Clean Light Theme**: Curated Slate/Indigo palette with comfortable touch targets (minimum 44×44 pt) and responsive typography.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** (0.86.2) | Core mobile UI framework |
| **Expo** (~57.0.13) | Development platform and native tooling |
| **TypeScript** (~5.8.2) | Strict type safety and data models |
| **Expo Router** (~57.0.13) | File-based navigation stack |
| **AsyncStorage** (2.2.0) | Asynchronous, unencrypted key-value persistent storage |
| **StyleSheet** | Native-optimized styling engine |

> **Zero Extra Abstractions**: Built purely with React hooks and native primitives—no Redux, no Zustand, no external UI component kits.

---

## Project Architecture & Data Flow

PocketTasks follows a strict **unidirectional data flow** with a clear separation of concerns:

```text
                        ┌─────────────────────────────────┐
                        │        Android Device           │
                        └────────────────┬────────────────┘
                                         │
                        ┌────────────────▼────────────────┐
                        │         app/index.tsx           │
                        │          (HomeScreen)           │
                        │    Owns State & Logic:          │
                        │    - tasks: Task[]              │
                        │    - filter: TaskFilter         │
                        │    - loading: boolean           │
                        └───────┬─────────────────┬───────┘
                                │                 │
            Props & Callbacks   │                 │  Async calls
                                │                 │
        ┌───────────────────────▼───────┐  ┌──────▼───────────────────────┐
        │          UI Layer             │  │        Data Layer            │
        │                               │  │                              │
        │  • TaskInput                  │  │  • utils/storage.ts          │
        │  • FilterBar                  │  │    (saveTasks, loadTasks)    │
        │  • TaskItem (FlatList)        │  │                              │
        │  • EmptyState                 │  │       AsyncStorage           │
        └───────────────────────────────┘  └──────────────────────────────┘
```

### Unidirectional Data Flow Rules:
1. **Parent $\to$ Child**: `HomeScreen` passes task data down as `props`.
2. **Child $\to$ Parent**: Child components notify `HomeScreen` of user events via callback functions (`onAddTask`, `onToggle`, `onDelete`, `onChange`).
3. **State Mutation**: Only `HomeScreen` modifies state (immutably).
4. **Storage Isolation**: UI components never touch `AsyncStorage` directly.

---

## Folder Structure

```text
PocketTasks/
│
├── app/
│   ├── _layout.tsx         # Root Stack configuration & StatusBar
│   └── index.tsx           # Main task management screen
│
├── components/
│   ├── TaskInput.tsx       # Task draft input & Add button
│   ├── TaskItem.tsx        # Individual task row with toggle and delete
│   ├── FilterBar.tsx       # All / Active / Completed filter toggle bar
│   └── EmptyState.tsx      # Contextual empty state illustrations
│
├── types/
│   └── task.ts             # TypeScript types (Task, TaskFilter)
│
├── utils/
│   └── storage.ts          # AsyncStorage load/save wrapper functions
│
├── constants/
│   └── colors.ts           # Centralized color design tokens
│
├── assets/
│   └── images/             # App icons and adaptive launcher assets
│
├── app.json                # Expo application configuration
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Documentation
```

---

## Getting Started & Running on Android

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer)
- [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) installed on your Android smartphone
- Your computer and Android device connected to the same Wi-Fi network (or use Tunnel mode)

### Installation
```bash
# 1. Clone or navigate to the project directory
cd pocket-tasks

# 2. Install dependencies
npm install

# 3. Verify TypeScript compile
npm run typecheck
```

### Running the App
```bash
# Start the Expo development server
npx expo start

# If your phone and PC are on different networks or behind a firewall, use Tunnel:
npx expo start --tunnel
```

1. Open the **Expo Go** app on your Android phone.
2. Tap **Scan QR code** and point your camera at the QR code displayed in your terminal.
3. PocketTasks will build and load immediately on your device!

---

## How Local Storage Works

Tasks are saved in the device's persistent storage using `@react-native-async-storage/async-storage`.

### Storage Key
```typescript
const TASKS_STORAGE_KEY = "@pockettasks/tasks";
```

### Safe Persistence Flow:
```text
1. App Mounts  ───►  loading = true
2. Storage Read ──►  loadTasks() reads JSON from AsyncStorage
3. State Init  ───►  setTasks(storedTasks) & setLoading(false)
4. User Edits  ───►  useEffect detects task update and calls saveTasks(tasks)
```

> **Why this matters**: If `loading` is not tracked, the initial state (`tasks = []`) would immediately overwrite existing saved tasks on launch before `loadTasks()` completes. By guarding `saveTasks` with `if (!loading)`, your data is 100% safe.

---

## Beginner's Guide to Core Concepts

### 1. React Concepts

- **Component**: Reusable, self-contained UI building blocks (like `TaskItem` or `FilterBar`).
- **Props**: Inputs passed from a parent component to a child (e.g. `<TaskItem task={item} onToggle={toggleTask} />`).
- **State (`useState`)**: Data that can change over time and triggers a visual re-render when updated (e.g. `tasks`, `filter`, `loading`).
- **Lifecycle Effects (`useEffect`)**: Handles side-effects outside pure rendering, such as loading tasks from disk when the screen mounts.

### 2. React Native Primitives

- `<View>`: The fundamental layout container (equivalent to `<div>` on web).
- `<Text>`: Must be used for rendering all text strings on mobile.
- `<TextInput>`: Input box allowing the user to type text via mobile keyboard.
- `<Pressable>`: Touch-responsive container that provides feedback (`pressed` state, touch ripples).
- `<FlatList>`: High-performance scrolling list that renders only visible items on screen, saving memory.
- `<SafeAreaView>`: Automatically adds padding so UI does not overlap device notches, status bars, or navigation bars.
- `StyleSheet.create()`: Compiles style rules into optimized numerical IDs for fast native layout calculations.

### 3. Modern JavaScript Patterns

- **`map()`**: Transforms every element in an array and returns a new array (used for immutable task toggling).
- **`filter()`**: Returns a new array containing only elements that pass a test condition (used for task deletion and derived views).
- **Spread Operator (`...`)**: Copies properties or array items without mutating the original reference (`[newTask, ...currentTasks]`).
- **Destructuring**: Conveniently extracts values from objects (`const { title, completed } = task;`).
- **`async/await`**: Clean syntax for handling asynchronous operations like disk I/O.

### 4. Mobile UX Principles

- **Touch Targets**: Buttons and checkboxes are sized at $\ge 44 \times 44\text{ pt}$ so they are easy to tap with a thumb.
- **Keyboard Handling**: `Keyboard.dismiss()` closes the software keyboard as soon as a task is submitted.
- **Derived State vs. Duplicated State**: Rather than keeping separate arrays for `activeTasks` or `completedTasks`, we calculate `filteredTasks` dynamically from the single `tasks` array.

---

## Key Architectural Decisions

1. **Why `HomeScreen` owns the state**:
   Keeping state centralized in the screen allows sibling components (`TaskInput`, `FilterBar`, and `FlatList`) to stay in sync effortlessly without complex event buses or external stores.
2. **Why UI components don't call storage**:
   Decoupling UI from `AsyncStorage` means the storage layer could easily be swapped for SQLite, WatermelonDB, or a cloud API in the future without changing a single line in `TaskItem.tsx` or `TaskInput.tsx`.
3. **Immutable Updates**:
   React relies on reference equality (`oldState !== newState`) to know when to re-render. We never modify arrays or objects directly (`task.completed = true`), but always return fresh copies.

---

## Future Improvements (Version 2 Roadmap)

- [ ] Task due dates and reminders (`expo-notifications`)
- [ ] Task priority badges (Low, Medium, High)
- [ ] Category / project tags
- [ ] Task search bar
- [ ] Dark theme toggle
- [ ] Cloud sync and authentication (Supabase / Firebase)

---

## License

MIT © PocketTasks
