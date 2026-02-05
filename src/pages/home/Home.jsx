import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import { Modal } from "../../components/modal/Modal";
import { TaskForm, TaskList, ProgressBar } from "../../components/tasks";
import "./Home.css";

export function Home() {
  const {
    tasks,
    isLoaded,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    completedCount,
    totalCount,
    progress,
  } = useTasks();

  const { theme, toggleTheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("dailytuki_welcomed");
  });

  const handleCloseWelcome = () => {
    localStorage.setItem("dailytuki_welcomed", "true");
    setShowWelcome(false);
  };

  if (!isLoaded) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>Daily Tuki</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      <main className="home-main">
        {totalCount > 0 && (
          <section className="progress-section">
            <ProgressBar
              progress={progress}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          </section>
        )}

        <section className="form-section">
          <TaskForm onAdd={addTask} />
        </section>

        <section className="tasks-section">
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </section>
      </main>

      <Modal
        open={showWelcome}
        title="¡Bienvenido a Daily Tuki!"
        onClose={handleCloseWelcome}
      >
        <p>Tu gestor de objetivos diarios.</p>
        <p>Cumplí al menos 2 de 3 objetivos para mantener tu racha 🔥</p>
      </Modal>
    </div>
  );
}
