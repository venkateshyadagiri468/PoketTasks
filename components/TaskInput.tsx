import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../constants/colors";

type TaskInputProps = {
  onAddTask: (title: string) => void;
};

/**
 * TaskInput Component
 * 
 * Renders a controlled text input bar with an "Add" button.
 * Encapsulates its own draft input state and invokes the parent's `onAddTask`
 * callback once validated.
 */
export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onAddTask(trimmedTitle);
    setTitle("");
    Keyboard.dismiss();
  };

  const isAddDisabled = title.trim().length === 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          maxLength={120}
          accessibilityLabel="New task input field"
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          isAddDisabled && styles.addButtonDisabled,
          pressed && !isAddDisabled && styles.addButtonPressed,
        ]}
        onPress={handleAdd}
        disabled={isAddDisabled}
        accessibilityRole="button"
        accessibilityLabel="Add task"
        accessibilityState={{ disabled: isAddDisabled }}
      >
        <Text
          style={[
            styles.addButtonText,
            isAddDisabled && styles.addButtonTextDisabled,
          ]}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: "center",
  },
  inputWrapperFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.surface,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  addButton: {
    backgroundColor: colors.primary,
    height: 52,
    width: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.96 }],
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "600",
    lineHeight: 28,
  },
  addButtonTextDisabled: {
    color: colors.muted,
  },
});
