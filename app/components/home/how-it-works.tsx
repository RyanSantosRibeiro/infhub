"use client";

import { motion } from "framer-motion";
import { Section } from "@/app/components/ui/section";

const steps = [
  {
    number: "01",
    color: "#06B6D4",
    colorBg: "rgba(6,182,212,0.08)",
    title: "Envie sua foto ou produto",
    description: "Faça upload da foto do produto ou do modelo. A IA analisa e entende o contexto automaticamente.",
    icon: "📤",
  },
  {
    number: "02",
    color: "#7C3AED",
    colorBg: "rgba(124,58,237,0.08)",
    title: "A IA cria em segundos",
    description: "Nossa inteligência artificial gera imagens e vídeos profissionais otimizados para cada plataforma.",
    icon: "🤖",
  },
  {
    number: "03",
    color: "#FE2C55",
    colorBg: "rgba(254,44,85,0.08)",
    title: "Baixe e publique",
    description: "Receba o pacote completo: imagens e vídeo prontos para o TikTok Shop e Instagram.",
    icon: "🚀",
  },
];

export function HowItWorks() {
  return (
    <Section
      badge="⚡ Como funciona"
      title="Simples assim. Em 3 passos."
      subtitle="Sem curva de aprendizado. Sem edição manual. Só resultados."
      className="section-alt"
    >
      <div className="relative">
        {/* Connector line — desktop */}
        <div className="absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-[var(--border-subtle)] hidden md:block z-0" />

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="group flex flex-col items-center md:items-start text-center md:text-left"
            >
              {/* Number circle */}
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black transition-transform duration-300 group-hover:scale-110"
                style={{ background: step.colorBg, border: `1px solid ${step.color}20` }}
              >
                <span className="text-xl">{step.icon}</span>
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: step.color }}
                >
                  {step.number}
                </span>
              </div>

              <h3
                className="text-xl font-bold mb-3 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
