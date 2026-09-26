import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AnimationOrchestrator } from "@/app/components/ui/animation-orchestrator";
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "FRAME — Sua live. Sua identidade. | Overlays para OBS", template: "%s | FRAME" },
  description: "Overlays para OBS com a sua identidade. Explore modelos gratuitos, personalize seu pack ou crie com IA. Pacotes para streamers a partir de R$ 29,90, sem assinatura.",
  keywords: ["overlays OBS", "overlay para live", "overlay gratuito", "overlays com IA", "streamers", "Twitch", "YouTube", "Streamlabs"],
  openGraph: { title: "FRAME — Sua live. Sua identidade.", description: "Um novo visual para a sua próxima live. Overlays prontos, personalizados e criados com IA.", locale: "pt_BR", type: "website", images: [{ url: "/images/hero-neon.png", width: 1672, height: 941, alt: "Universo neon FRAME, overlays para streamers" }] },
  twitter: { card: "summary_large_image" }, icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><AnimationOrchestrator />{children}</body></html>;
}
