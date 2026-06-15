"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import "./accordion.scss";

// One expandable row. Define these as children of <Accordion>; the wrapper
// injects isOpen/onToggle via cloneElement.
export function AccordionItem({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen?: boolean; onToggle?: () => void }) {
  return (
    <li className={`accordion-item${isOpen ? " is-open" : ""}`}>
      <button type="button" className="accordion-trigger" aria-expanded={isOpen} onClick={onToggle}>
        <span className="accordion-title">{title}</span>
        <span className="accordion-icon" aria-hidden="true" />
      </button>
      <div className="accordion-panel" hidden={!isOpen}>
        {typeof children === "string" ? <p>{children}</p> : children}
      </div>
    </li>
  );
}

export default function Accordion({ children }: { children: React.ReactNode }) {
  // Rows toggle independently (several can be open at once).
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <ul className="nsc-accordion">
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement, { isOpen: open.has(i), onToggle: () => toggle(i) } as any)
          : child,
      )}
    </ul>
  );
}
