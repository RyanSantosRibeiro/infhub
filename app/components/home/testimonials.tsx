"use client";

import { motion } from "framer-motion";
import { Section } from "@/app/components/ui/section";
import { Star, Quotes } from "@phosphor-icons/react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Criadora de Conteúdo",
    initials: "MS",
    gradient: "from-pink-400 to-rose-500",
    text: "O InfHub transformou completamente minha produtividade. Antes eu gastava horas editando, agora em 5 minutos tenho conteúdo pronto para postar!",
    stars: 5,
  },
  {
    name: "João Pedro",
    role: "Vendedor TikTok Shop",
    initials: "JP",
    gradient: "from-violet-400 to-purple-500",
    text: "Minhas vendas triplicaram depois que comecei a usar os modelos de IA. O vídeo que a IA gera é absurdamente profissional.",
    stars: 5,
  },
  {
    name: "Carla Oliveira",
    role: "Social Media Manager",
    initials: "CO",
    gradient: "from-cyan-400 to-blue-500",
    text: "O criador de carrosséis é sensacional. Os templates são lindos e a IA ajuda demais na hora de escrever o conteúdo dos slides.",
    stars: 5,
  },
  {
    name: "Rafael Costa",
    role: "Dono de E-commerce",
    initials: "RC",
    gradient: "from-amber-400 to-orange-500",
    text: "O melhor investimento que fiz pro meu negócio. A qualidade dos materiais gerados surpreende até clientes que contratam agências.",
    stars: 5,
  },
  {
    name: "Beatriz Lima",
    role: "Influenciadora de Moda",
    initials: "BL",
    gradient: "from-rose-400 to-fuchsia-500",
    text: "Consigo criar 30 posts de uma vez com looks diferentes. Meu feed nunca ficou tão profissional. A IA entende exatamente o que preciso!",
    stars: 5,
  },
  {
    name: "Thiago Mendes",
    role: "Fotógrafo & Creator",
    initials: "TM",
    gradient: "from-emerald-400 to-teal-500",
    text: "Uso para complementar meu trabalho de fotografia. Os backgrounds gerados por IA são incríveis e economizo horas em pós-produção.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <Section
      badge="💬 Depoimentos reais"
      title="Criadores que amam o InfHub"
      subtitle="Mais de 2.500 criadores já estão acelerando seus resultados com nossa plataforma."
      className="section-alt"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="flex flex-col bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-subtle)] shadow-clean hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Quote icon */}
            <Quotes weight="fill" className="w-6 h-6 text-[var(--infhub-purple)]/25 mb-4 flex-shrink-0" />

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(t.stars)].map((_, j) => (
                <Star key={j} weight="fill" className="w-3.5 h-3.5 text-amber-400" />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-5">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-xs font-bold text-white">{t.initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
