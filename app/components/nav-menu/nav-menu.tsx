"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "./nav-menu.scss";

/** A single navigation entry. Define these directly as children of NavMenu. */
export function NavLink({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;

  return (
    <li className="nav-menu-item">
      <Link
        href={href}
        className={`nav-menu-link ${isActive ? "active" : ""}`}
        onClick={(e) => {
          // Drop focus so the tapped link doesn't retain a sticky focus/hover
          // style on touch devices, then close the menu.
          e.currentTarget.blur();
          onNavigate?.();
          // Tapping the page you're already on takes you home.
          if (isActive) {
            e.preventDefault();
            router.push("/");
          }
        }}
      >
        {children}
      </Link>
    </li>
  );
}

export default function NavMenu({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`nav-menu ${className}`.trim()}>
      <button className="nav-menu-hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Meniu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-menu-list ${isOpen ? "open" : ""}`}>
        {Children.map(children, (child) =>
          isValidElement(child) ? cloneElement(child as React.ReactElement, { onNavigate: () => setIsOpen(false) } as any) : child,
        )}
      </ul>
    </nav>
  );
}
