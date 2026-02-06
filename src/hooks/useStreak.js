import { useState, useEffect, useCallback } from "react";
import { storage } from "../services/storage";

const STREAK_KEY = storage.KEYS.STREAK;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function loadInitialState() {
  const saved = storage.get(STREAK_KEY);
  if (!saved) {
    return { currentStreak: 0, lastCompletedDate: null, bestStreak: 0 };
  }

  const { lastCompletedDate } = saved;
  if (lastCompletedDate && lastCompletedDate !== getToday() && lastCompletedDate !== getYesterday()) {
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
        if (targetDate !== getToday()) {
          return { ...prev, currentStreak: 0 };
        }
        return prev;
      }

      const newStreak = prev.currentStreak + 1;
      return {
        currentStreak: newStreak,
        lastCompletedDate: targetDate,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  }, []);

  return {
    currentStreak: streakData.currentStreak,
    bestStreak: streakData.bestStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    registerDayResult,
  };
}
