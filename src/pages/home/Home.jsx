import { useState, useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useStreak } from "../../hooks/useStreak";
import { useTheme } from "../../hooks/useTheme";
import { Modal } from "../../components/modal/Modal";
import { TaskForm, TaskList, ProgressBar } from "../../components/tasks";
import { StreakBadge } from "../../components/streak";
import "./Home.css";

export function Home() {
  const {
    tasks,
    isLoaded,
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
    dayChanged,
    previousDayResult,
    clearPreviousDayResult,
  } = useTasks();

  const {
    currentStreak,
    bestStreak,
    registerDayResult,
  } = useStreak();

  const { theme, toggleTheme } = useTheme();

  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("dailytuki_welcomed");
  });

  useEffect(() => {
    if (dayChanged && previousDayResult) {
      registerDayResult(previousDayResult.completedCount, previousDayResult.totalCount, previousDayResult.date);
      clearPreviousDayResult();
      return;
    }

    if (isDayComplete) {
      registerDayResult(completedCount, totalCount);
    }
  }, [dayChanged, previousDayResult, isDayComplete, completedCount, totalCount, registerDayResult, clearPreviousDayResult]);

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
        <section className="streak-section">
          <StreakBadge
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            isDayComplete={isDayComplete}
          />
        </section>

        {totalCount > 0 && (
          <section className="progress-section">
            <ProgressBar
              progress={progress}
              completedCount={completedCount}
              totalCount={totalCount}
            />
            <p className="goal-hint">
              Objetivo: completar al menos {minRequired} de {totalCount} tareas
            </p>
          </section>
        )}

        <section className="form-section">
          <TaskForm onAdd={addTask} />
        </section>

        <section className="tasks-section">
          <TaskList
            tasks={tasks}
            onToggle={requestToggle}
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

      {dayChanged && previousDayResult && (
        <Modal
          open={true}
          title={previousDayResult.wasSuccessful ? "¡Buen trabajo ayer!" : "Nuevo día"}
          onClose={clearPreviousDayResult}
        >
          {previousDayResult.wasSuccessful ? (
            <p>
              Completaste {previousDayResult.completedCount} de {previousDayResult.totalCount} tareas.
              ¡Tu racha continúa! 🔥
            </p>
          ) : (
            <p>
              Ayer completaste {previousDayResult.completedCount} de {previousDayResult.totalCount} tareas.
              ¡Hoy es un nuevo comienzo!
            </p>
          )}
        </Modal>
      )}

      {pendingToggle && (
        <Modal
          open={true}
          title="¿Completaste esta tarea?"
          onClose={cancelToggle}
        >
          <p className="confirm-task-text">"{pendingToggle.text}"</p>
          <p className="confirm-task-warning">
            Una vez confirmada, no podrás desmarcarla hoy.
          </p>
          <div className="confirm-actions">
            <button className="btn-cancel" onClick={cancelToggle}>
              Cancelar
            </button>
            <button className="btn-confirm" onClick={confirmToggle}>
              ¡Sí, la completé!
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
