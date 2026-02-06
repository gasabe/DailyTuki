import { useEffect, useState, useCallback } from "react";
import { storage } from "../services/storage";

function makeId() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
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

const TASKS_KEY = storage.KEYS.TASKS;
const LAST_DATE_KEY = "dailytuki_last_date_v1";
const COMPLETED_TODAY_KEY = "dailytuki_completed_today_v1";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [completedTodayIds, setCompletedTodayIds] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [dayChanged, setDayChanged] = useState(false);
  const [previousDayResult, setPreviousDayResult] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);

  useEffect(() => {
    const saved = storage.get(TASKS_KEY) ?? [];
    const lastDate = storage.get(LAST_DATE_KEY);
    const savedCompletedToday = storage.get(COMPLETED_TODAY_KEY) ?? [];
    const today = getToday();

    let normalizedTasks = normalizeTasks(saved);

    if (lastDate && lastDate !== today) {
      const completedCount = normalizedTasks.filter((t) => t.done).length;
      const totalCount = normalizedTasks.length;
      const minRequired = Math.min(2, totalCount);
      const wasSuccessful = totalCount > 0 && completedCount >= minRequired;

      setPreviousDayResult({
        completedCount,
        totalCount,
        wasSuccessful,
        date: lastDate,
      });

      normalizedTasks = normalizedTasks.map((t) => ({ ...t, done: false }));
      setCompletedTodayIds(new Set());
      storage.set(COMPLETED_TODAY_KEY, []);
      setDayChanged(true);
    } else {
      setCompletedTodayIds(new Set(savedCompletedToday));
    }

    storage.set(LAST_DATE_KEY, today);
    setTasks(normalizedTasks);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.set(TASKS_KEY, tasks);
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((text) => {
    const clean = String(text ?? "").trim();
    if (!clean) return false;
    setTasks((prev) => [createTask(clean), ...prev]);
    return true;
  }, []);

  const requestToggle = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.done) {
      return;
    }

    setPendingToggle({ id, text: task.text });
  }, [tasks]);

  const confirmToggle = useCallback(() => {
    if (!pendingToggle) return;

    const { id } = pendingToggle;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: true } : t))
    );

    setCompletedTodayIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      storage.set(COMPLETED_TODAY_KEY, Array.from(next));
      return next;
    });

    setPendingToggle(null);
  }, [pendingToggle]);

  const cancelToggle = useCallback(() => {
    setPendingToggle(null);
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

  const clearPreviousDayResult = useCallback(() => {
    setPreviousDayResult(null);
    setDayChanged(false);
  }, []);

  const completedCount = completedTodayIds.size;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const minRequired = Math.min(2, totalCount);
  const isDayComplete = totalCount > 0 && completedCount >= minRequired;

  return {
    tasks,
    isLoaded,
    addTask,
    requestToggle,
    confirmToggle,
    cancelToggle,
    pendingToggle,
    updateTask,
    deleteTask,
    clearCompleted,
    completedCount,
    totalCount,
    progress,
    isDayComplete,
    minRequired,
    dayChanged,
    previousDayResult,
    clearPreviousDayResult,
  };
}
