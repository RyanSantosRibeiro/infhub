"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Sparkle, Play, ArrowRight, CheckCircle } from "@phosphor-icons/react";

const floatingCards = [
  { gradient: "from-rose-400 via-pink-500 to-fuchsia-600", label: "Moda & Fashion", tag: "TikTok Shop" },
  { gradient: "from-cyan-400 via-blue-500 to-indigo-600", label: "Tech & Gadgets", tag: "Instagram" },
  { gradient: "from-violet-400 via-purple-500 to-indigo-600", label: "Beauty & Skin", tag: "Reels" },
  { gradient: "from-amber-400 via-orange-500 to-rose-600", label: "Food & Lifestyle", tag: "Feed" },
];

const highlights = ["Sem edição manual", "Pronto em 60 segundos", "100% comercial"];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      {/* Subtle blob backgrounds */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[var(--infhub-purple)]/6 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--infhub-magenta)]/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--infhub-cyan)]/6 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left Column ── */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--infhub-purple)]/10 text-[var(--infhub-purple)] border border-[var(--infhub-purple)]/20">
                <Sparkle weight="fill" className="w-3.5 h-3.5" />
                Plataforma IA para Criadores
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] mb-6 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-heading)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Conteúdo que{" "}
              <span className="text-gradient">vende</span>
              {", "}
              <br className="hidden sm:block" />
              criado pela IA.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6 max-w-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              Envie sua foto ou produto e receba imagens e vídeos prontos para{" "}
              <span className="font-semibold text-[var(--infhub-magenta)]">TikTok Shop</span> e{" "}
              <span className="font-semibold text-[var(--infhub-cyan)]">Instagram</span>{" "}
              em menos de 1 minuto.
            </motion.p>

            {/* Highlights */}
            <motion.ul
              className="flex flex-col sm:flex-row gap-3 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
            >
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <CheckCircle weight="fill" className="w-4 h-4 text-[var(--infhub-purple)] flex-shrink-0" />
                  {h}
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={<Sparkle weight="fill" className="w-5 h-5" />}
                iconRight={<ArrowRight weight="bold" className="w-4 h-4" />}
              >
                Começar Grátis
              </Button>
              <Button variant="ghost" size="lg" icon={<Play weight="fill" className="w-4 h-4" />}>
                Ver como funciona
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="mt-12 flex items-center gap-4 pt-8 border-t border-[var(--border-subtle)] w-full max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex -space-x-2.5">
                {["from-pink-400 to-rose-500", "from-violet-400 to-purple-500", "from-cyan-400 to-blue-500", "from-amber-400 to-orange-500", "from-emerald-400 to-teal-500"].map((g, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br ${g} flex-shrink-0`}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">+2.500 criadores</p>
                <p className="text-xs text-[var(--text-muted)]">já usam o InfHub hoje</p>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column — Floating Card Mockup ── */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main grid */}
            <div className="relative grid grid-cols-2 gap-3 w-full max-w-sm">
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${card.gradient} relative overflow-hidden group cursor-pointer`}
                  animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-xs font-semibold">{card.label}</p>
                    <span className="text-[10px] text-white/70">{card.tag}</span>
                  </div>
                  {/* AI badge */}
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5">
                    <span className="text-[9px] font-bold text-white tracking-wider">AI</span>
                  </div>
                </motion.div>
              ))}

              {/* Floating stats card */}
              <motion.div
                className="absolute -bottom-6 -left-10 bg-white rounded-2xl shadow-clean p-4 flex items-center gap-3 z-20"
                style={{ boxShadow: "0 4px 24px rgba(15,23,42,0.12)" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--infhub-magenta)] to-[var(--infhub-purple)] flex items-center justify-center flex-shrink-0">
                  <Sparkle weight="fill" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Gerado agora</p>
                  <p className="text-[11px] text-slate-500">47 imagens hoje</p>
                </div>
              </motion.div>

              {/* Floating time card */}
              <motion.div
                className="absolute -top-6 -right-10 bg-white rounded-xl shadow-clean px-4 py-2.5 z-20"
                style={{ boxShadow: "0 4px 24px rgba(15,23,42,0.12)" }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xs text-slate-500">Tempo médio</p>
                <p className="text-sm font-bold text-slate-800">⚡ 52 segundos</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
