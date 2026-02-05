const KEYS = {
  TASKS: "dailytuki_tasks_v1",
  STREAK: "dailytuki_streak_v1",
  THEME: "dailytuki_theme_v1",
};

export const storage = {
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  KEYS,
};
