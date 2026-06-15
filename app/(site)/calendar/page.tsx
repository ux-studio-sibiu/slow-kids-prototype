import Image from "next/image";
import Link from "next/link";
import { getEvents } from "@/sanity/sanity.query";
import { dayKey } from "@/app/components/calendar/day-key";
import "./calendar.scss";

export const revalidate = 60; // seconds

export default async function CalendarIndexPage() {
  const events = await getEvents();
  const now = Date.now();
  const upcoming = events
    .filter((e) => e.date && new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div id="nsc--calendar" className="has-splatter-bg">
      <div className="calendar-inner">
        <p className="calendar-hint">
          Selectează o zi marcată din calendar pentru a vedea evenimentul.
        </p>

        {upcoming.length > 0 && (
          <>
            <h2 className="calendar-upcoming-title">Evenimente următoare</h2>
            <ul className="calendar-teaser-list">
              {upcoming.map((event) => {
                const d = new Date(event.date);
                const cover = event.photos?.[0];
                return (
                  <li key={event._id}>
                    <Link href={`/calendar/${dayKey(d)}`} className="calendar-teaser">
                      <span className="calendar-teaser-date">
                        <span className="calendar-teaser-day">{d.toLocaleDateString("ro-RO", { day: "2-digit" })}</span>
                        <span className="calendar-teaser-month">{d.toLocaleDateString("ro-RO", { month: "short" })}</span>
                      </span>
                      <span className="calendar-teaser-body">
                        <span className="calendar-teaser-title">{event.title}</span>
                        {event.meetPoint && <span className="calendar-teaser-meta">{event.meetPoint}</span>}
                      </span>
                      {cover?.url && (
                        <span className="calendar-teaser-thumb">
                          <Image src={cover.url} alt={event.title} fill sizes="130px" className="object-cover" placeholder={cover.lqip ? "blur" : undefined} blurDataURL={cover.lqip} />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
