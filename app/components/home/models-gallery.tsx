"use client";

import { motion } from "framer-motion";
import { Section } from "@/app/components/ui/section";
import { Badge } from "@/app/components/ui/badge";

const models = [
  { name: "Sofia", style: "Fashion", gradient: "from-pink-400 to-rose-600" },
  { name: "Lucas", style: "Streetwear", gradient: "from-cyan-400 to-blue-600" },
  { name: "Ana", style: "Beauty", gradient: "from-violet-400 to-purple-600" },
  { name: "Pedro", style: "Fitness", gradient: "from-emerald-400 to-teal-600" },
  { name: "Julia", style: "Lifestyle", gradient: "from-amber-400 to-orange-600" },
  { name: "Rafael", style: "Tech", gradient: "from-blue-400 to-indigo-600" },
  { name: "Camila", style: "Food", gradient: "from-red-400 to-pink-600" },
  { name: "Thiago", style: "Sports", gradient: "from-green-400 to-emerald-600" },
];

export function ModelsGallery() {
  return (
    <Section
      badge="✨ Modelos de IA"
      title="Seu modelo. Seu rosto. Seus resultados."
      subtitle="Escolha entre dezenas de modelos profissionais ou faça upload da sua própria foto para criar conteúdo totalmente personalizado."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {models.map((model, i) => (
          <motion.div
            key={i}
            className="group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <div
              className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${model.gradient} relative overflow-hidden mb-3 shadow-clean`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              {/* Hover overlay with name */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-white">Ver mais</span>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="gradient" className="text-[10px] px-2 py-0.5">AI</Badge>
              </div>
            </div>
            <p className="text-sm font-semibold text-center text-[var(--text-primary)]">{model.name}</p>
            <p className="text-xs text-[var(--text-muted)] text-center">{model.style}</p>
          </motion.div>
        ))}
      </div>

      {/* Upload CTA */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-dashed border-[var(--border-default)] hover:border-[var(--infhub-purple)] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-[var(--infhub-purple)]/10 flex items-center justify-center group-hover:bg-[var(--infhub-purple)]/20 transition-colors">
            <span className="text-lg">📸</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Use seu próprio rosto</p>
            <p className="text-xs text-[var(--text-muted)]">Faça upload e treine um modelo personalizado</p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
