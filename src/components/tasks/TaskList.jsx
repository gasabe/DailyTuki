import { TaskItem } from "./TaskItem";
import "./TaskList.css";

function DayGroup({ day }) {
  return (
    <div className="day-group">
      <div className="day-header">
        <span className="day-label">{day.label}</span>
        <span className="day-count">
          {day.completedCount}/{day.totalCount}
        </span>
      </div>
      <ul className="task-list">
        {day.tasks.map((task) => (
          <li key={task.id}>
            <TaskItem task={task} readOnly />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TaskList({ todayTasks, previousDays, onToggle, onUpdate, onDelete }) {
  return (
    <div className="task-list-container">
      {todayTasks.length === 0 ? (
        <div className="task-list-empty">
          <p>No hay tareas para hoy</p>
          <p className="hint">¡Agregá tu primer objetivo del día!</p>
        </div>
      ) : (
        <ul className="task-list">
          {todayTasks.map((task) => (
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
      )}

      {previousDays.length > 0 && (
        <div className="previous-days">
          <h3 className="previous-days-title">Días anteriores</h3>
          {previousDays.map((day) => (
            <DayGroup key={day.date} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}
