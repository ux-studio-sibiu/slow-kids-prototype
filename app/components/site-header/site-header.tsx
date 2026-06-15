import Image from "next/image";
import Link from "next/link";
import logo from "@/media/logo-text.png";
import NavMenu, { NavLink } from "../nav-menu/nav-menu";
import "./site-header.scss";

export default function SiteHeader({ title, tagline }: { title: string; tagline?: string }) {
  return (
    <header className="nsc-site-header">
      <Link href="/" className="site-header-brand" aria-label={title}>
        <Image src={logo} alt={title} className="site-header-logo" priority />
      </Link>
      {tagline && <p className="site-header-tagline">{tagline}</p>}
      <NavMenu>
        <NavLink href="/about">Despre</NavLink>
        <NavLink href="/calendar">Calendar</NavLink>
        <NavLink href="/faq">Întrebări frecvente</NavLink>
      </NavMenu>
    </header>
  );
}
