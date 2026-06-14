import Link from "next/link";
import NavMenu, { NavLink } from "../nav-menu/nav-menu";
import "./site-header.scss";

export default function SiteHeader({ title, tagline }: { title: string; tagline?: string }) {
  return (
    <header className="nsc-site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-header-brand text-uppercase">
          {title}
        </Link>
        <NavMenu>
          <NavLink href="/about">Despre</NavLink>
          <NavLink href="/calendar">Calendar</NavLink>
          <NavLink href="/faq">Întrebări frecvente</NavLink>
        </NavMenu>
      </div>
      {tagline && <p className="site-header-tagline">{tagline}</p>}
    </header>
  );
}
