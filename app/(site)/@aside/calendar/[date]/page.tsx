import CalendarAside from "@/app/components/calendar/calendar-aside";

// Keeps the hero + floating calendar mounted on /calendar/[date]; the calendar
// reads the active day from the URL to highlight it.
export default function CalendarAsideDatePage() {
  return <CalendarAside />;
}
