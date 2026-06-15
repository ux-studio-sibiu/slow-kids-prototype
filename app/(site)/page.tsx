import { getEvents } from "@/sanity/sanity.query";
import UpcomingEvents from "@/app/components/upcoming-events/upcoming-events";
import "./page.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const events = await getEvents();

  return (
    <div id="nsc--home">
      <section className="home-events">
        {events.length === 0 ? (
          <p className="home-events-empty">
            Niciun eveniment momentan. Reveniți în curând.
          </p>
        ) : (
          <UpcomingEvents events={events} />
        )}
      </section>
    </div>
  );
}
