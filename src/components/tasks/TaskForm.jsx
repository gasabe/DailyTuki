import { useState } from "react";
import "./TaskForm.css";

export function TaskForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd(text)) {
      setText("");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nueva tarea..."
        className="task-input"
      />
      <button type="submit" className="task-submit" disabled={!text.trim()}>
        Agregar
      </button>
    </form>
  );
}
