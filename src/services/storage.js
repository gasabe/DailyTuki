const CURRENT_VERSION = 2;
const VERSION_KEY = "dailytuki_version";

const KEYS = {
  TASKS: "dailytuki_tasks_v2",
  STREAK: "dailytuki_streak_v2",
  THEME: "dailytuki_theme_v1",
};

function migrate() {
  const version = parseInt(localStorage.getItem(VERSION_KEY) || "0", 10);
  if (version < CURRENT_VERSION) {
    localStorage.removeItem("dailytuki_tasks_v1");
    localStorage.removeItem("dailytuki_streak_v1");
    localStorage.removeItem("dailytuki_last_date_v1");
    localStorage.removeItem("dailytuki_completed_today_v1");
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  }
}

migrate();

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
