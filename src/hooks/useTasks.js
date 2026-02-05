import { useEffect, useState, useCallback } from "react";
import { storage } from "../services/storage";

function makeId() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTask(text) {
  return {
    id: makeId(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
}

function normalizeTasks(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    if (typeof t === "string") return createTask(t);
    return {
      id: t.id ?? makeId(),
      text: t.text ?? t.title ?? "",
      done: Boolean(t.done),
      createdAt: t.createdAt ?? new Date().toISOString(),
    };
  });
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = storage.get(storage.KEYS.TASKS) ?? [];
    setTasks(normalizeTasks(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.set(storage.KEYS.TASKS, tasks);
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((text) => {
    const clean = String(text ?? "").trim();
    if (!clean) return false;
    setTasks((prev) => [createTask(clean), ...prev]);
    return true;
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const updateTask = useCallback((id, newText) => {
    const clean = String(newText ?? "").trim();
    if (!clean) return false;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: clean } : t))
    );
    return true;
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    tasks,
    isLoaded,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    clearCompleted,
    completedCount,
    totalCount,
    progress,
  };
}
