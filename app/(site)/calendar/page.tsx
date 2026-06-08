import { getEvents } from "@/sanity/sanity.query";
import "./calendar.scss";

export const revalidate = 60; // seconds

export default async function Calendar() {
  const events = await getEvents();

  // Show events in chronological order (oldest → newest) for a calendar feel.
  const ordered = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <main id="nsc--calendar">
      <div className="calendar-inner">
        <h1 className="calendar-title">Calendar</h1>

        {ordered.length === 0 ? (
          <p className="calendar-empty">Niciun eveniment programat.</p>
        ) : (
          <ul className="calendar-list">
            {ordered.map((event) => {
              const date = new Date(event.date);
              return (
                <li key={event._id} className="calendar-item">
                  <div className="calendar-date">
                    <span className="calendar-date-day">
                      {date.toLocaleDateString("ro-RO", { day: "2-digit" })}
                    </span>
                    <span className="calendar-date-month">
                      {date.toLocaleDateString("ro-RO", { month: "short" })}
                    </span>
                    <span className="calendar-date-year">
                      {date.getFullYear()}
                    </span>
                  </div>
                  <div className="calendar-body">
                    <h2 className="calendar-name">{event.title}</h2>
                    <span className="calendar-time">
                      {date.toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
