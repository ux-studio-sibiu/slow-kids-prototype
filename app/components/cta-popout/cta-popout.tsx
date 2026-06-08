import Link from "next/link";
import "./cta-popout.scss";

export type CtaPopoutProps = {
  title?: string;
  /** Body paragraphs. Each string becomes its own <p>. */
  paragraphs?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export default function CtaPopout({
  title = "Gata de aventură?",
  paragraphs = [
    "Rezervați un loc la următorul atelier, verificați datele de start și consultați programul evenimentelor.",
    "Sunteți o școală sau o grădiniță? Contactați-ne direct pentru a discuta cum putem colabora.",
  ],
  ctaLabel = "Rezervă acum",
  ctaHref = "/calendar",
}: CtaPopoutProps) {
  return (
    <section className="nsc-cta-popout">
      <div className="cta-popout-band">
        <div className="cta-popout-inner">
          <div className="cta-popout-text">
            <h2 className="cta-popout-title">{title}</h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="cta-popout-paragraph">
                {p}
              </p>
            ))}
          </div>

          <Link href={ctaHref} className="cta-popout-button text-uppercase">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
