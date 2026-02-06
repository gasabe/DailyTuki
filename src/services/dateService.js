function getOffset() {
  if (import.meta.env.DEV) {
    return parseInt(sessionStorage.getItem("__dev_offset") || "0", 10);
  }
  return 0;
}

function setOffset(days) {
  sessionStorage.setItem("__dev_offset", String(days));
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getToday() {
  const d = new Date();
  d.setDate(d.getDate() + getOffset());
  return formatLocalDate(d);
}

export function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() + getOffset() - 1);
  return formatLocalDate(d);
}

if (import.meta.env.DEV) {
  window.__devSkipDay = (days = 1) => {
    const newOffset = getOffset() + days;
    setOffset(newOffset);
    console.log(`[DEV] Offset: +${newOffset} días → hoy es ${getToday()}`);
    console.log("[DEV] Recargá la página para ver el cambio de día");
  };

  window.__devResetDate = () => {
    setOffset(0);
    console.log(`[DEV] Offset reseteado → hoy es ${getToday()}`);
  };

  window.__devGetToday = () => {
    console.log(`[DEV] Hoy: ${getToday()}, offset: +${getOffset()}`);
    return getToday();
  };
}
