import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { HeroSection } from "@/app/components/home/hero-section";
import { ModelsGallery } from "@/app/components/home/models-gallery";
import { HowItWorks } from "@/app/components/home/how-it-works";
import { ShowcaseGrid } from "@/app/components/home/showcase-grid";
import { PricingSection } from "@/app/components/home/pricing-section";
import { Testimonials } from "@/app/components/home/testimonials";
import { FAQSection } from "@/app/components/home/faq-section";
import { CTASection } from "@/app/components/home/cta-section";

export default function Home() {
  return (
    <div className="theme-light">
      <Header theme="light" />
      <main className="flex-1 bg-[var(--bg-primary)]">
        <HeroSection />
        <ModelsGallery />
        <HowItWorks />
        <ShowcaseGrid />
        <PricingSection />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer theme="light" />
    </div>
  );
}
