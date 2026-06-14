// Local-time "YYYY-MM-DD" key for a Date. Shared by the calendar grid and the
// /calendar/[date] routes so both agree on which day an event falls on
// (matching the grid, which is built in local time).
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
