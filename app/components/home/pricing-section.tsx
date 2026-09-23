"use client";

import { motion } from "framer-motion";
import { Section } from "@/app/components/ui/section";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Check, Lightning, Sparkle } from "@phosphor-icons/react";

const plans = [
  {
    name: "Starter",
    description: "Para quem está começando.",
    price: "29",
    period: "/mês",
    tokens: 50,
    popular: false,
    accentColor: "#06B6D4",
    features: [
      "50 tokens / mês",
      "Modelos de IA básicos",
      "Criador de carrosséis",
      "Export em PNG",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Pro",
    description: "Para criadores que querem escalar.",
    price: "79",
    period: "/mês",
    tokens: 200,
    popular: true,
    accentColor: "#7C3AED",
    features: [
      "200 tokens / mês",
      "Todos os modelos de IA",
      "Vídeos para TikTok Shop",
      "Carrosséis avançados",
      "Legendas com IA",
      "Templates exclusivos",
      "Suporte prioritário",
    ],
  },
  {
    name: "Business",
    description: "Para agências e equipes.",
    price: "199",
    period: "/mês",
    tokens: 600,
    popular: false,
    accentColor: "#FE2C55",
    features: [
      "600 tokens / mês",
      "Tudo do plano Pro",
      "API de integração",
      "Membros ilimitados",
      "Templates customizados",
      "Account manager dedicado",
      "Relatórios de performance",
    ],
  },
];

export function PricingSection() {
  return (
    <Section
      badge="💰 Planos e preços"
      title="Invista no seu crescimento"
      subtitle="Comece grátis com 10 tokens e escale conforme seus resultados crescem."
      id="pricing"
    >
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-3xl overflow-hidden ${
              plan.popular ? "shadow-[0_8px_40px_rgba(124,58,237,0.18)]" : "shadow-clean"
            } bg-[var(--bg-primary)] border ${
              plan.popular ? "border-[var(--infhub-purple)]/40" : "border-[var(--border-subtle)]"
            }`}
          >
            {/* Top accent bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: plan.accentColor }}
            />

            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute top-5 right-5">
                <Badge variant="gradient">
                  <Lightning weight="fill" className="w-3 h-3" />
                  Popular
                </Badge>
              </div>
            )}

            <div className="flex flex-col flex-1 p-7">
              {/* Plan name */}
              <div className="mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${plan.accentColor}15` }}
                >
                  <Sparkle weight="fill" className="w-5 h-5" style={{ color: plan.accentColor }} />
                </div>
                <h3
                  className="text-xl font-bold text-[var(--text-primary)] mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {plan.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-end gap-1">
                  <span className="text-sm text-[var(--text-muted)] mb-1.5">R$</span>
                  <span
                    className="text-5xl font-extrabold text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-heading)", lineHeight: 1 }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-[var(--text-muted)] mb-1.5">{plan.period}</span>
                </div>
              </div>
              <p className="text-xs font-semibold mb-7" style={{ color: plan.accentColor }}>
                {plan.tokens} tokens inclusos por mês
              </p>

              {/* CTA */}
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                fullWidth
                size="lg"
                className="mb-7"
              >
                {plan.popular ? "Assinar agora" : "Começar"}
              </Button>

              {/* Divider */}
              <div className="border-t border-[var(--border-subtle)] mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${plan.accentColor}15` }}
                    >
                      <Check weight="bold" className="w-3 h-3" style={{ color: plan.accentColor }} />
                    </div>
                    <span className="text-[var(--text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom note */}
      <motion.p
        className="text-center text-sm text-[var(--text-muted)] mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        Todos os planos incluem acesso ao studio. Cancele quando quiser. Sem taxas ocultas.
      </motion.p>
    </Section>
  );
}
