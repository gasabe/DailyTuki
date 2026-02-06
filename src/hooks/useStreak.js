import { useState, useEffect, useCallback } from "react";
import { storage } from "../services/storage";
import { getToday, getYesterday } from "../services/dateService";

const STREAK_KEY = storage.KEYS.STREAK;

function dayBefore(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadInitialState() {
  const saved = storage.get(STREAK_KEY);
  if (!saved) {
    return { currentStreak: 0, lastCompletedDate: null, bestStreak: 0 };
  }

  const { lastCompletedDate } = saved;
  const today = getToday();
  const yesterday = getYesterday();

  if (lastCompletedDate && lastCompletedDate !== today && lastCompletedDate !== yesterday) {
    return { ...saved, currentStreak: 0 };
  }

  return saved;
}

export function useStreak() {
  const [streakData, setStreakData] = useState(loadInitialState);

  useEffect(() => {
    storage.set(STREAK_KEY, streakData);
  }, [streakData]);

  const registerDayResult = useCallback((completedCount, totalCount, date) => {
    const targetDate = date ?? getToday();
    const minRequired = Math.min(2, totalCount);
    const dayCompleted = totalCount > 0 && completedCount >= minRequired;

    setStreakData((prev) => {
      if (prev.lastCompletedDate === targetDate) {
        return prev;
      }

      if (!dayCompleted) {
        return prev;
      }

      const expectedPrevDay = dayBefore(targetDate);
      const isConsecutive =
        !prev.lastCompletedDate ||
        prev.lastCompletedDate === expectedPrevDay ||
        prev.lastCompletedDate === targetDate;

      const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;

      const next = {
        currentStreak: newStreak,
        lastCompletedDate: targetDate,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };

      if (import.meta.env.DEV) {
        console.log("[STREAK]", { targetDate, isConsecutive, prev, next });
      }

      return next;
    });
  }, []);

  return {
    currentStreak: streakData.currentStreak,
    bestStreak: streakData.bestStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    registerDayResult,
  };
}
