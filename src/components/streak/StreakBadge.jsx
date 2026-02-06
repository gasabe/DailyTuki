import "./StreakBadge.css";

export function StreakBadge({ currentStreak, bestStreak, isDayComplete }) {
  return (
    <div className={`streak-badge ${isDayComplete ? "streak-badge--complete" : ""}`}>
      <div className="streak-main">
        <span className="streak-fire">🔥</span>
        <span className="streak-count">{currentStreak}</span>
        <span className="streak-label">días</span>
      </div>
      {bestStreak > 0 && (
        <div className="streak-best">
          Mejor racha: {bestStreak}
        </div>
      )}
      {isDayComplete && (
        <div className="streak-complete">
          ¡Día completado!
        </div>
      )}
    </div>
  );
}
