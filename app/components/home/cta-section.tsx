"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Sparkle, Lightning } from "@phosphor-icons/react";

const perks = [
  { icon: "⚡", text: "Pronto em 60 segundos" },
  { icon: "🎯", text: "Otimizado para conversão" },
  { icon: "🔒", text: "Uso comercial incluído" },
  { icon: "✨", text: "10 tokens grátis para começar" },
];

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--infhub-purple) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="relative rounded-[2.5rem] overflow-hidden"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #06B6D4 0%, #7C3AED 45%, #FE2C55 100%)",
            }}
          />

          {/* Overlay pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Inner glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />

          {/* Content */}
          <div className="relative z-10 py-20 px-8 sm:px-16 text-center">
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Lightning weight="fill" className="w-8 h-8 text-white" />
            </motion.div>

            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Pronto para criar conteúdo
              <br />
              que realmente vende?
            </h2>

            <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Junte-se a mais de 2.500 criadores que já estão acelerando suas vendas no TikTok Shop e engajamento no Instagram.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium"
                >
                  <span>{perk.icon}</span>
                  {perk.text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-white/95 active:scale-[0.98] transition-all duration-200 shadow-lg"
              >
                <Sparkle weight="fill" className="w-5 h-5 text-[#7C3AED]" />
                Criar Conta Grátis
                <ArrowRight weight="bold" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
                Ver planos e preços
                <ArrowRight weight="bold" className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-6 text-white/50 text-xs">
              Não requer cartão de crédito. Comece com 10 tokens gratuitos.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
