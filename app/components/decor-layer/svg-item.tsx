// Server component — reads SVG from public/ at render time.
// Replaces hardcoded fill/stroke with currentColor so the `color` prop
// controls all fills without editing the SVG files.
import { readFileSync } from "fs";
import { join } from "path";
import type { CSSProperties } from "react";

interface SvgItemProps {
  /** Path relative to /public, e.g. "/images/foliage-3.svg" */
  src: string;
  /** CSS color value — resolves as currentColor inside the SVG. */
  color?: string;
  width?: CSSProperties["width"];
  top?: CSSProperties["top"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  left?: CSSProperties["left"];
  rotate?: number;
  scale?: number;
  opacity?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export function SvgItem({
  src,
  color,
  width = "8rem",
  top,
  right,
  bottom,
  left,
  rotate = 0,
  scale = 1,
  opacity = 1,
  flipX = false,
  flipY = false,
}: SvgItemProps) {
  let markup = readFileSync(join(process.cwd(), "public", src), "utf8");

  // Replace hardcoded fills/strokes with currentColor — covers both
  // presentation attributes (fill="…") and inline style (style="fill:…").
  // fill="none" / fill:none are intentional cutouts — leave those alone.
  markup = markup
    .replace(/\bfill="(?!none)[^"]*"/g, 'fill="currentColor"')
    .replace(/\bstroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
    .replace(/(\bfill\s*:\s*)(?!none\b)[^;"}]*/g, "$1currentColor")
    .replace(/(\bstroke\s*:\s*)(?!none\b)[^;"}]*/g, "$1currentColor");

  // Strip fixed width/height from the root <svg> so it scales to the wrapper.
  markup = markup
    .replace(/(<svg\b[^>]*?)\s+width="[^"]*"/, "$1")
    .replace(/(<svg\b[^>]*?)\s+height="[^"]*"/, "$1")
    .replace(/<svg\b/, '<svg fill="currentColor" width="100%" height="auto"');

  const sx = flipX ? -scale : scale;
  const sy = flipY ? -scale : scale;
  const transform =
    [
      rotate !== 0 && `rotate(${rotate}deg)`,
      (sx !== 1 || sy !== 1) && `scale(${sx}, ${sy})`,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      style={{
        position: "absolute",
        width,
        top,
        right,
        bottom,
        left,
        transform,
        opacity,
        color,
        userSelect: "none",
        pointerEvents: "none",
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
