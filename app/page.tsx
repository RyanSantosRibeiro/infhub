import { StoreHeader } from "@/app/components/store/store-header";
import { StoreHero } from "@/app/components/store/store-hero";
import { OverlayGallery } from "@/app/components/store/overlay-gallery";
import { StoreSections } from "@/app/components/store/store-sections";
import { StoreFooter } from "@/app/components/store/store-footer";
import { faqs } from "@/lib/store/catalog";
export default function Home() {
  return <><StoreHeader /><main id="conteudo"><StoreHero /><OverlayGallery /><StoreSections /></main><StoreFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }).replace(/</g, "\\u003c") }} /></>;
}
