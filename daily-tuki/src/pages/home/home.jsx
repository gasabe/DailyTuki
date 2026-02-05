import { useEffect, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import { Modal } from "../../components/modal/Modal";

export function Home() {
  const { tasks, addTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    console.log("tasks:", tasks);
  }, [tasks]);

  return (
    <div>
      <h1>Daily Tuki</h1>

      <button onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <button onClick={() => addTask("tarea nueva")}>
        Agregar tarea
      </button>

      <Modal
        open={showWelcome}
        title="¡Bienvenido!"
        onClose={() => setShowWelcome(false)}
      >
        <p>Bienvenido a Daily Tuki, tu gestor de tareas diarias.</p>
      </Modal>
    </div>
  );
}
