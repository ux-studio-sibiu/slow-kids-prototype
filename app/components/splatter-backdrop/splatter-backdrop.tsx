import "./splatter-backdrop.scss";

export type SplatterBackdropProps = {
  children?: React.ReactNode;
  className?: string;
  /** HTML element to render as (default: "div"). */
  as?: "div" | "section";
};

/**
 * Wraps content with the decorative paint-splatter textures rendered on a
 * ::before layer behind the content (so opacity / z-index never affect the
 * children). Splatter art is sourced from We Are Adventurers via the
 * `copy-from-web` skill. Tune intensity with the `--splatter-opacity` custom
 * property, e.g. `<SplatterBackdrop style={{ "--splatter-opacity": 0.35 }} />`.
 */
export default function SplatterBackdrop({
  children,
  className = "",
  as: Tag = "div",
}: SplatterBackdropProps) {
  return (
    <Tag className={`nsc-splatter-backdrop ${className}`.trim()}>{children}</Tag>
  );
}
