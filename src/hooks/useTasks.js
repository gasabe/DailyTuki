import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { storage } from "../services/storage";
import { getToday } from "../services/dateService";

function makeId() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTask(text) {
  return {
    id: makeId(),
    text: text.trim(),
    done: false,
    assignedDate: getToday(),
  };
}

function normalizeTasks(raw, fallbackDate) {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    if (typeof t === "string") return createTask(t);
    return {
      id: t.id ?? makeId(),
      text: t.text ?? t.title ?? "",
      done: Boolean(t.done),
      assignedDate: t.assignedDate ?? fallbackDate,
    };
  });
}

const TASKS_KEY = storage.KEYS.TASKS;
const LAST_DATE_KEY = "dailytuki_last_date_v2";

function formatDayLabel(dateStr) {
  const today = getToday();
  if (dateStr === today) return "Hoy";

  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function initState() {
  const lastDate = storage.get(LAST_DATE_KEY);
  const today = getToday();
  const fallbackDate = lastDate ?? today;
  const tasks = normalizeTasks(storage.get(TASKS_KEY) ?? [], fallbackDate);

  let previousDayResult = null;

  if (lastDate && lastDate !== today) {
    const prevTasks = tasks.filter((t) => t.assignedDate === lastDate);
    const completedCount = prevTasks.filter((t) => t.done).length;
    const totalCount = prevTasks.length;
    const minRequired = Math.min(2, totalCount);

    previousDayResult = {
      completedCount,
      totalCount,
      wasSuccessful: totalCount > 0 && completedCount >= minRequired,
      date: lastDate,
    };

    if (import.meta.env.DEV) {
      console.log("[DAY CHANGE]", lastDate, "→", today, previousDayResult);
    }
  }

  storage.set(LAST_DATE_KEY, today);
  storage.set(TASKS_KEY, tasks);

  if (import.meta.env.DEV) {
    const todayCount = tasks.filter((t) => t.assignedDate === today).length;
    console.log("[INIT] today:", today, "| tasks today:", todayCount, "| total:", tasks.length);
  }

  return { tasks, previousDayResult };
}

export function useTasks() {
  const [{ tasks, previousDayResult: initialDayResult }] = useState(initState);
  const [taskList, setTaskList] = useState(tasks);
  const [previousDayResult, setPreviousDayResult] = useState(initialDayResult);
  const [pendingToggle, setPendingToggle] = useState(null);
  const lastSavedRef = useRef(JSON.stringify(tasks));

  useEffect(() => {
    const key = JSON.stringify(taskList);
    if (key !== lastSavedRef.current) {
      storage.set(TASKS_KEY, taskList);
      lastSavedRef.current = key;
    }
  }, [taskList]);

  const today = getToday();

  const todayTasks = useMemo(
    () => taskList.filter((t) => t.assignedDate === today),
    [taskList, today]
  );

  const previousDays = useMemo(() => {
    const groups = {};
    for (const t of taskList) {
      if (t.assignedDate === today) continue;
      if (!groups[t.assignedDate]) groups[t.assignedDate] = [];
      groups[t.assignedDate].push(t);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, dayTasks]) => ({
        date,
        label: formatDayLabel(date),
        tasks: dayTasks,
        completedCount: dayTasks.filter((t) => t.done).length,
        totalCount: dayTasks.length,
      }));
  }, [taskList, today]);

  const checkNewDay = useCallback(() => {
    const lastDate = storage.get(LAST_DATE_KEY);
    const now = getToday();
    if (lastDate === now) return false;

    setTaskList((prev) => {
      const prevTasks = prev.filter((t) => t.assignedDate === lastDate);
      const completedCount = prevTasks.filter((t) => t.done).length;
      const totalCount = prevTasks.length;
      const minRequired = Math.min(2, totalCount);

      setPreviousDayResult({
        completedCount,
        totalCount,
        wasSuccessful: totalCount > 0 && completedCount >= minRequired,
        date: lastDate,
      });

      storage.set(LAST_DATE_KEY, now);
      return prev;
    });

    return true;
  }, []);

  const addTask = useCallback((text) => {
    const clean = String(text ?? "").trim();
    if (!clean) return false;
    setTaskList((prev) => [createTask(clean), ...prev]);
    return true;
  }, []);

  const requestToggle = useCallback((id) => {
    const task = todayTasks.find((t) => t.id === id);
    if (!task || task.done) return;
    setPendingToggle({ id, text: task.text });
  }, [todayTasks]);

  const confirmToggle = useCallback(() => {
    if (!pendingToggle) return;
    const { id } = pendingToggle;
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: true } : t))
    );
    setPendingToggle(null);
  }, [pendingToggle]);

  const cancelToggle = useCallback(() => {
    setPendingToggle(null);
  }, []);

  const updateTask = useCallback((id, newText) => {
    const clean = String(newText ?? "").trim();
    if (!clean) return false;
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: clean } : t))
    );
    return true;
  }, []);

  const deleteTask = useCallback((id) => {
    setTaskList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearPreviousDayResult = useCallback(() => {
    setPreviousDayResult(null);
  }, []);

  const completedCount = todayTasks.filter((t) => t.done).length;
  const totalCount = todayTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const minRequired = Math.min(2, totalCount);
  const isDayComplete = totalCount > 0 && completedCount >= minRequired;

  return {
    todayTasks,
    previousDays,
    addTask,
    requestToggle,
    confirmToggle,
    cancelToggle,
    pendingToggle,
    updateTask,
    deleteTask,
    completedCount,
    totalCount,
    progress,
    isDayComplete,
    minRequired,
    previousDayResult,
    clearPreviousDayResult,
    checkNewDay,
  };
}
