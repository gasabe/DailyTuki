import { TaskItem } from "./TaskItem";
import "./TaskList.css";

export function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No hay tareas todavía</p>
        <p className="hint">¡Agregá tu primer objetivo del día!</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
