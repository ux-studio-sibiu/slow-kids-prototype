import Image from "next/image";
import { getEvents } from "@/sanity/sanity.query";
import CtaPopout from "@/app/components/cta-popout/cta-popout";
import "./page.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const events = await getEvents();

  return (
    <div id="nsc--home">
      <CtaPopout />

      <section className="home-events has-splatter-bg">
        <h2 className="home-events-title">Evenimente</h2>

        {events.length === 0 ? (
          <p className="home-events-empty">
            Niciun eveniment momentan. Reveniți în curând.
          </p>
        ) : (
          <ul className="home-events-list">
            {events.map((event) => {
              const cover = event.photos?.[0];
              return (
                <li key={event._id} className="home-events-item">
                  {cover?.url && (
                    <div className="home-events-thumb">
                      <Image src={cover.url} alt={event.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" placeholder={cover.lqip ? "blur" : undefined} blurDataURL={cover.lqip} />
                    </div>
                  )}
                  <div className="home-events-body">
                    <span className="home-events-date">
                      {new Date(event.date).toLocaleDateString("ro-RO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="home-events-name">{event.title}</h3>
                    {event.photos && event.photos.length > 1 && (
                      <span className="home-events-count">
                        {event.photos.length} fotografii
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
