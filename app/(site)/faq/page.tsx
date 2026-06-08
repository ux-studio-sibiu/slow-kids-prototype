import { getGeneralInfo } from "@/sanity/sanity.query";
import "./faq.scss";

export const revalidate = 60; // seconds

export default async function Faq() {
  const info = await getGeneralInfo();
  const items = info?.faq ?? [];

  return (
    <main id="nsc--faq">
      <div className="faq-inner">
        <h1 className="faq-title">Întrebări frecvente</h1>

        {items.length === 0 ? (
          <p className="faq-empty">
            Adăugați întrebări frecvente în Setări website.
          </p>
        ) : (
          <div className="faq-list">
            {items.map((item, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">{item.question}</summary>
                <p className="faq-answer">{item.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
