import { PortableText } from "@portabletext/react";
import type { EventType } from "@/types";

// Minimal line icons (stroke = currentColor) for each meta field.
const iconProps = {
  className: "calendar-meta-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const META_ICONS: Record<string, React.ReactNode> = {
  // clock
  time: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  // hourglass
  duration: (
    <svg {...iconProps}>
      <path d="M7 3h10M7 21h10M9 3v4l3 3 3-3V3M9 21v-4l3-3 3 3v4" />
    </svg>
  ),
  // map pin
  place: (
    <svg {...iconProps}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  // price tag
  price: (
    <svg {...iconProps}>
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-6.2-6.2A2 2 0 0 1 3.8 13V5.8A2 2 0 0 1 5.8 3.8H13a2 2 0 0 1 1.4.6l6.2 6.2a2 2 0 0 1 0 2.8z" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  // people
  seats: (
    <svg {...iconProps}>
      <circle cx="10" cy="8" r="3" />
      <path d="M4 19a6 6 0 0 1 12 0" />
      <path d="M16.5 5.6a3 3 0 0 1 0 4.8M20 19a6 6 0 0 0-3-5.2" />
    </svg>
  ),
};

export default function EventDetail({ event }: { event: EventType }) {
  // Prefer the explicit start time; fall back to the date's time.
  const startTime =
    event.startTime ||
    new Date(event.date).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

  const meta = [
    { id: "time", label: "Ora de început", value: startTime },
    { id: "duration", label: "Durată", value: event.duration },
    { id: "place", label: "Punct de întâlnire", value: event.meetPoint },
    { id: "price", label: "Preț", value: event.price },
    {
      id: "seats",
      label: "Locuri disponibile",
      value: event.maxParticipants != null ? String(event.maxParticipants) : undefined,
    },
  ].filter((row) => row.value);

  return (
    <li className="calendar-event">
      <h2 className="calendar-event-name">{event.title}</h2>

      {event.description && event.description.length > 0 && (
        <div className="calendar-event-description has-portable-text">
          <PortableText value={event.description} />
        </div>
      )}

      {meta.length > 0 && (
        <dl className="calendar-meta">
          {meta.map((row) => (
            <div key={row.label} className="calendar-meta-row">
              <dt>
                {META_ICONS[row.id]}
                <span>{row.label}</span>
              </dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {event.importantNote && event.importantNote.length > 0 && (
        <div className="calendar-note has-portable-text">
          <span className="calendar-note-label">Notă importantă</span>
          <PortableText value={event.importantNote} />
        </div>
      )}
    </li>
  );
}
