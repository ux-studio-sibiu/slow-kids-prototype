import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-text.png";
import NavMenu, { NavLink } from "../nav-menu/nav-menu";
import "./site-header.scss";

export default function SiteHeader() {
  return (
    <header className="nsc-site-header">
      <Link href="/" className="site-header-brand" aria-label="Acasă">
        <Image src={logo} alt="Slow Play" className="site-header-logo" priority />
      </Link>
      <NavMenu>
        <NavLink href="/about">Despre</NavLink>
        <NavLink href="/calendar">Calendar</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        <NavLink href="/faq">Jurnal</NavLink>
        {/* <NavLink href="/faq">Întrebări frecvente</NavLink> */}
      </NavMenu>
    </header>
  );
}
