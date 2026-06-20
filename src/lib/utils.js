// ============================================================
//  utils.js  —  small helpers used across the app
//  (dates, ids, sorting, and the colour map for task states)
// ============================================================

// ---- dates ----
export const parseDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// whole days from today until the given date string (negative = in the past)
export const daysTo = (s) => Math.round((parseDate(s) - todayDate()) / 86400000);

// "20 Jun"
export const fmt = (s) =>
  parseDate(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// "Sat, 20 Jun"
export const fmtLong = (s) =>
  parseDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export const toICSDate = (s) => s.replace(/-/g, "");

export const addDay = (s) => {
  const d = parseDate(s);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ---- misc ----
export const newId = () => "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const clone = (x) => JSON.parse(JSON.stringify(x));
export const sortTasks = (a) =>
  [...a].sort((x, y) => {
    if (!x.due) return 1;
    if (!y.due) return -1;
    return parseDate(x.due) - parseDate(y.due);
  });

// ---- task-state colours (overdue / due-this-week / scheduled / done) ----
export const taskState = (t) => {
  if (t.done) return "done";
  if (!t.due) return "scheduled";
  const d = daysTo(t.due);
  return d < 0 ? "overdue" : d <= 7 ? "week" : "scheduled";
};

export const STATE = {
  overdue:   { bar: "#f43f5e", chip: "#fecdd3", text: "#9f1239" },
  week:      { bar: "#f59e0b", chip: "#fde68a", text: "#92400e" },
  scheduled: { bar: "#cbd5e1", chip: "#e2e8f0", text: "#475569" },
  done:      { bar: "#10b981", chip: "#f1f5f9", text: "#94a3b8" },
};
