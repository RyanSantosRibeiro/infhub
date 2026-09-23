import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InfHub — Plataforma para Criadores de Conteúdo com IA",
  description:
    "Crie imagens e vídeos de alta conversão para TikTok Shop e carrosséis profissionais para Instagram usando Inteligência Artificial.",
  keywords: ["IA", "TikTok Shop", "Instagram", "carrossel", "criador de conteúdo", "infocards"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${inter.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
