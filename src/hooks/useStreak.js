import { useState, useEffect, useCallback } from "react";
import { storage } from "../services/storage";

const STREAK_KEY = storage.KEYS.STREAK;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getInitialState() {
  const saved = storage.get(STREAK_KEY);
  if (!saved) {
    return {
      currentStreak: 0,
      lastCompletedDate: null,
      bestStreak: 0,
    };
  }
  return saved;
}

export function useStreak() {
  const [streakData, setStreakData] = useState(getInitialState);

  useEffect(() => {
    storage.set(STREAK_KEY, streakData);
  }, [streakData]);

  const registerDayResult = useCallback((completedCount, totalCount) => {
    const today = getToday();
    const minRequired = Math.min(2, totalCount);
    const dayCompleted = totalCount > 0 && completedCount >= minRequired;

    setStreakData((prev) => {
      if (prev.lastCompletedDate === today) {
        return prev;
      }

      if (dayCompleted) {
        const newStreak = prev.currentStreak + 1;
        return {
          currentStreak: newStreak,
          lastCompletedDate: today,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      }

      return prev;
    });

    return dayCompleted;
  }, []);

  const checkStreakContinuity = useCallback(() => {
    const today = getToday();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    setStreakData((prev) => {
      if (!prev.lastCompletedDate) return prev;
      if (prev.lastCompletedDate === today) return prev;
      if (prev.lastCompletedDate === yesterdayStr) return prev;

      return {
        ...prev,
        currentStreak: 0,
      };
    });
  }, []);

  return {
    currentStreak: streakData.currentStreak,
    bestStreak: streakData.bestStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    registerDayResult,
    checkStreakContinuity,
  };
}
