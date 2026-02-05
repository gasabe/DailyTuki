import "./ProgressBar.css";

export function ProgressBar({ progress, completedCount, totalCount }) {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-label">Progreso del día</span>
        <span className="progress-count">
          {completedCount}/{totalCount} completadas
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="progress-percent">{progress}%</span>
    </div>
  );
}
