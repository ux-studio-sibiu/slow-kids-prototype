import HeroSwiper from "@/app/components/hero-swiper/hero-swiper";
import { getEvents } from "@/sanity/sanity.query";
import CalendarNav from "./calendar-nav";
import "./calendar-aside.scss";

// Left-panel content on /calendar routes: the hero image fills the panel and
// the calendar floats over it as a centred card (image stays visible around it).
export default async function CalendarAside() {
  const events = await getEvents();

  return (
    <div className="nsc-calendar-aside">
      <div className="calendar-aside-hero">
        <HeroSwiper />
      </div>
      <CalendarNav events={events} />
    </div>
  );
}
