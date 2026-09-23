"use client";

import { motion } from "framer-motion";
import { Section } from "@/app/components/ui/section";

const showcaseItems = [
  { gradient: "from-pink-500 via-rose-500 to-fuchsia-600", span: "col-span-2 row-span-2", label: "Fashion Drop" },
  { gradient: "from-cyan-400 via-sky-500 to-blue-600", span: "col-span-1 row-span-1", label: "Tech Review" },
  { gradient: "from-violet-500 via-purple-500 to-indigo-600", span: "col-span-1 row-span-1", label: "Beauty Haul" },
  { gradient: "from-amber-400 via-orange-500 to-rose-600", span: "col-span-1 row-span-2", label: "Food Shoot" },
  { gradient: "from-emerald-400 via-teal-500 to-cyan-600", span: "col-span-1 row-span-1", label: "Fitness" },
  { gradient: "from-rose-400 via-pink-500 to-purple-600", span: "col-span-1 row-span-1", label: "Lifestyle" },
];

export function ShowcaseGrid() {
  return (
    <Section
      badge="🎨 Portfólio"
      title="O que a IA consegue criar"
      subtitle="Resultados reais gerados para criadores. Cada imagem foi produzida em menos de 1 minuto."
      className="section-alt"
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {showcaseItems.map((item, i) => (
          <motion.div
            key={i}
            className={`${item.span} rounded-2xl bg-gradient-to-br ${item.gradient} relative overflow-hidden group cursor-pointer`}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-all duration-300" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">{item.label}</span>
                <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white rounded-full px-2 py-0.5">IA</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats bar */}
      <motion.div
        className="mt-10 grid grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {[
          { value: "1.200+", label: "Imagens geradas hoje" },
          { value: "52s", label: "Tempo médio de geração" },
          { value: "4.9★", label: "Avaliação dos criadores" },
        ].map((stat, i) => (
          <div key={i} className="text-center py-5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-clean">
            <p className="text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
              {stat.value}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}
