import { getGeneralInfo } from "@/sanity/sanity.query";
import Accordion, { AccordionItem } from "@/app/components/accordion/accordion";
import { DecorLayer } from "@/app/components/decor-layer/decor-layer";
import { SvgItem } from "@/app/components/decor-layer/svg-item";
import "./faq.scss";

export const revalidate = 60; // seconds

export default async function Faq() {
  const info = await getGeneralInfo();
  const items = info?.faq ?? [];

  return (
    <div id="nsc--faq">
      <DecorLayer color="rgba(0,0,0,0.1)">
        <SvgItem src="/svg/vines-7.svg" left="-8%" top="5%" width="18rem" rotate={8} />
        <SvgItem src="/svg/more-leaves-4.svg" right="2%" top="55%" width="14rem" rotate={-12} flipX />
        <SvgItem src="/svg/leaves-6.svg" left="3%" bottom="5%" width="12rem" rotate={15} />
        <SvgItem src="/svg/butterfly-2.svg" right="8%" top="18%" width="9rem" rotate={10} />
      </DecorLayer>
      <div className="page-content">
        <h1 className="faq-title">Întrebări frecvente</h1>

        {items.length === 0 ? (
          <p className="faq-empty">
            Adăugați întrebări frecvente în Setări website.
          </p>
        ) : (
          <Accordion>
            {items.map((item, i) => (
              <AccordionItem key={i} title={item.question}>{item.answer}</AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
