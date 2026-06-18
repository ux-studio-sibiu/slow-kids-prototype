"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { EventType } from "@/types";
import { dayKey } from "./day-key";
import "./calendar-nav.scss";

// Monday-first week order (Sunday last), Romanian short names.
const WEEKDAYS = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

// Offset of the 1st of the month within a Monday-first week (Mon=0 … Sun=6).
const mondayFirstOffset = (m: number, y: number) =>
  (new Date(y, m, 1).getDay() + 6) % 7;

// The current month, as {month, year}.
function currentMonth() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

// True when {month, year} falls before the current month.
function isBeforeCurrentMonth(month: number, year: number) {
  const cur = currentMonth();
  return year < cur.year || (year === cur.year && month < cur.month);
}

// Clamp a view so the calendar never opens on a past month.
function clampToCurrent(view: { month: number; year: number }) {
  return isBeforeCurrentMonth(view.month, view.year) ? currentMonth() : view;
}

// Open on the soonest upcoming event's month, or the current month. Past months
// are never shown.
function focusMonth(events: EventType[]) {
  const now = Date.now();
  const upcoming = events
    .filter((e) => e.date && new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  if (!upcoming) return currentMonth();
  const d = new Date(upcoming.date);
  return { month: d.getMonth(), year: d.getFullYear() };
}

export default function CalendarNav({ events }: { events: EventType[] }) {
  const pathname = usePathname();
  // Active day comes from the URL (/calendar/YYYY-MM-DD), so the grid highlights
  // whatever the right panel is showing — the same usePathname trick as NavLink.
  const activeDate = pathname.match(/^\/calendar\/(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;

  // Days that have at least one event (so only those become links).
  const eventDays = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.date && set.add(dayKey(new Date(e.date))));
    return set;
  }, [events]);

  const [view, setView] = useState(() =>
    clampToCurrent(
      activeDate
        ? { month: new Date(activeDate).getMonth(), year: new Date(activeDate).getFullYear() }
        : focusMonth(events),
    ),
  );
  const { month, year } = view;

  // Follow the selected date when it changes to another month (e.g. opened from
  // an upcoming-event link in the right panel). Past months are clamped away.
  useEffect(() => {
    if (!activeDate) return;
    const d = new Date(activeDate);
    const target = clampToCurrent({ month: d.getMonth(), year: d.getFullYear() });
    if (target.month !== month || target.year !== year) {
      setView(target);
    }
  }, [activeDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: mondayFirstOffset(month, year) }, (_, i) => i);
  const monthName = new Date(year, month).toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
  const todayKey = dayKey(new Date());

  // The previous-month arrow is only available once you've moved past the
  // current month — past months are never reachable.
  const cur = currentMonth();
  const canGoPrev = year > cur.year || (year === cur.year && month > cur.month);

  const prevMonth = () => {
    if (!canGoPrev) return;
    setView({ month: month === 0 ? 11 : month - 1, year: month === 0 ? year - 1 : year });
  };
  const nextMonth = () => setView({ month: month === 11 ? 0 : month + 1, year: month === 11 ? year + 1 : year });

  return (
    <div className="nsc-calendar-nav">
      <div className="calendar-header">
        <button type="button" className="calendar-nav-btn" onClick={prevMonth} disabled={!canGoPrev} aria-label="Luna precedentă">‹</button>
        <h2 className="calendar-month">{monthName}</h2>
        <button type="button" className="calendar-nav-btn" onClick={nextMonth} aria-label="Luna următoare">›</button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="calendar-day is-empty" />
        ))}

        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEvents = eventDays.has(dateStr);
          const cls = `calendar-day ${hasEvents ? "has-events" : "is-free"} ${
            todayKey === dateStr ? "is-today" : ""
          } ${activeDate === dateStr ? "is-selected" : ""}`;

          // Only days with events are navigable; free days are inert.
          if (!hasEvents) {
            return (
              <div key={day} className={cls}>
                <span className="calendar-day-num">{day}</span>
              </div>
            );
          }

          return (
            <Link key={day} href={`/calendar/${dateStr}`} className={cls}>
              <span className="calendar-day-sun" aria-hidden="true" />
              <span className="calendar-day-num">{day}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
