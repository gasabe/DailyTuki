import { useEffect, useState } from "react";
import { loadTasks, saveTasks } from "../domain/task/tasks.storage.js";

export function useTasks() {
  const [tasks, setTasks] = useState([]);

  // cargar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadTasks());
  }, []);

  // guardar
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // acciones
  function addTask(task) {
    setTasks((prev) => [...prev, task]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  return {
    tasks,
    addTask,
    toggleTask,
  };
}
