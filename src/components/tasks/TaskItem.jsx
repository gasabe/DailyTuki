import { useState } from "react";
import "./TaskItem.css";

export function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate(task.id, editText)) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form className="task-item task-item--editing" onSubmit={handleSubmit}>
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          className="task-edit-input"
        />
        <div className="task-actions">
          <button type="submit" className="btn-save">✓</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>✕</button>
        </div>
      </form>
    );
  }

  return (
    <div className={`task-item ${task.done ? "task-item--done" : ""}`}>
      <label className={`task-checkbox ${task.done ? "task-checkbox--locked" : ""}`}>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => !task.done && onToggle(task.id)}
          disabled={task.done}
        />
        <span className="checkmark" />
      </label>
      <span className="task-text">{task.text}</span>
      <div className="task-actions">
        {!task.done && (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>✎</button>
        )}
        {!task.done && (
          <button className="btn-delete" onClick={() => onDelete(task.id)}>🗑</button>
        )}
      </div>
    </div>
  );
}
