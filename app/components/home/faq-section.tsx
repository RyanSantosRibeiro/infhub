"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/app/components/ui/section";
import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";

const faqs = [
  {
    question: "Os conteúdos gerados são livres de direitos autorais?",
    answer: "Sim! Todas as imagens e vídeos gerados pelos nossos modelos de IA podem ser usados comercialmente nas suas campanhas de TikTok Shop, Instagram ou Facebook Ads sem necessidade de pagar royalties extras.",
  },
  {
    question: "Como funciona o sistema de tokens?",
    answer: "Cada ação no InfHub consome uma quantidade específica de tokens. Gerar uma imagem simples custa 1 token, enquanto gerar um vídeo complexo com dublagem pode custar 5 tokens. Os tokens do plano mensal renovam a cada ciclo.",
  },
  {
    question: "Posso fazer upload do meu próprio rosto?",
    answer: "Sim! Nossos planos incluem a funcionalidade 'Face Swap' onde você pode treinar um modelo com o seu próprio rosto e criar centenas de fotos e vídeos em diferentes cenários e estilos.",
  },
  {
    question: "Qual o formato das exportações do carrossel?",
    answer: "Os carrosséis são exportados em PNG em alta resolução na proporção 4:5 (1080x1350px), que é o formato mais recomendado para engajamento no Instagram hoje.",
  },
  {
    question: "Preciso ter conhecimento de edição?",
    answer: "Nenhum! Nossa plataforma foi desenhada para ser intuitiva. Com alguns cliques você escolhe o template, ajusta o texto, gera a imagem por IA e baixa tudo pronto para postar.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, sem complicações. Você pode cancelar sua assinatura a qualquer momento pelo painel e não será cobrado no próximo ciclo. Seus créditos restantes ficam disponíveis até o fim do período pago.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section
      badge="❓ Dúvidas"
      title="Perguntas Frequentes"
      subtitle="Tudo que você precisa saber antes de começar."
    >
      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${
                isOpen
                  ? "border-[var(--infhub-purple)]/30 bg-[var(--bg-primary)]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-default)]"
              }`}
              style={{
                boxShadow: isOpen ? "0 2px 16px rgba(124,58,237,0.08)" : "none",
              }}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span
                  className={`text-sm font-semibold leading-snug transition-colors ${
                    isOpen ? "text-[var(--infhub-purple)]" : "text-[var(--text-primary)]"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-[var(--infhub-purple)] text-white rotate-180"
                      : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                  }`}
                >
                  <CaretDown weight="bold" size={14} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      {/* Left accent line */}
                      <div className="flex gap-4">
                        <div className="w-0.5 rounded-full flex-shrink-0 bg-[var(--infhub-purple)]/30" />
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
