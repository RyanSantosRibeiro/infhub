"use client";
import { useState } from "react";
import {
  ArrowRight, ArrowUpRight, Sparkle, Check, Plus,
  GameController, MagicWand, DownloadSimple, ShieldCheck,
  MonitorPlay, DeviceMobile, CursorClick,
} from "@phosphor-icons/react";
import { faqs } from "@/lib/store/catalog";
import { CheckoutModal } from "./checkout-modal";

const plans = [
  { id: "ready" as const, name: "Ready", tagline: "Seu próximo visual está pronto.", price: "29", features: ["Um modelo da coleção", "Seu nome e suas redes", "Pacote completo para OBS", "Formatos 16:9 e 9:16"], cta: "Escolher meu modelo" },
  { id: "custom" as const, name: "Custom", tagline: "Um modelo. Do seu jeito.", price: "59", features: ["Tudo do Ready", "Sua paleta de cores", "Estilo e posição dos elementos", "Identidade consistente nas cenas"], cta: "Personalizar meu pack" },
  { id: "ai" as const, name: "AI Custom", tagline: "Uma ideia sua. Um universo novo.", price: "99", features: ["Tudo do Custom", "Cenário exclusivo gerado por IA", "Criação a partir do seu briefing", "Prévia do cenário no pacote"], cta: "Criar com inteligência artificial" },
];

const steps = [
  { icon: CursorClick, number: "01", title: "Encontre sua vibe", text: "Escolha um modelo ou conte pra nossa IA como você imagina sua live." },
  { icon: MagicWand,    number: "02", title: "Deixe com a sua cara", text: "Seu nome, suas cores, sua comunidade. Escolha o pacote ideal e personalize." },
  { icon: DownloadSimple, number: "03", title: "Baixe. Abra o OBS. Brilhe.", text: "Pagamento aprovado? Acompanhe a geração, baixe seu pack e siga o tutorial." },
];

const packItems = ["Starting Soon & Ending","Live & Just Chatting","BRB / Já volto","Moldura de webcam","Chat box & redes sociais","Lower third & alertas visuais","Transição em HTML","Tutorial de instalação"];

export function StoreSections() {
  const [plan, setPlan] = useState<"ready" | "custom" | "ai" | null>(null);

  return (
    <>
      {/* ── COMO FUNCIONA ────────────────────────────────────── */}
      <section className="how-section section-space" id="como-funciona">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">DO SEU JEITO. SEM COMPLICAÇÃO.</span>
              <h2>Do primeiro clique ao "estamos ao vivo".</h2>
            </div>
            <p>Você cuida do conteúdo.<br/>O resto é com a gente.</p>
          </div>
          <div className="steps-grid">
            {steps.map(({ icon: Icon, number, title, text }, i) => (
              <div className="step-card" key={number} data-reveal data-reveal-delay={String(i * 120)}>
                <div>
                  <span className="step-icon"><Icon size={25}/></span>
                  <span className="step-number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACK SECTION ─────────────────────────────────────── */}
      <section className="pack-section">
        <div className="shell pack-inner">
          {/* Visual animado — float via CSS */}
          <div className="pack-visual" data-reveal="left">
            <div className="pack-window pack-window-back">
              <span>● ● ●</span>
              <strong>BE RIGHT<br/>BACK<span>✳</span></strong>
            </div>
            <div className="pack-window pack-window-front">
              <div><span className="status-dot"/> LIVE NOW <span>16:9</span></div>
              <div className="pack-cam"><GameController size={34}/></div>
              <strong>YOUR NAME<span>YOUR WORLD.</span></strong>
              <small>↗ @yourname</small>
            </div>
            <div className="pack-phone">
              <span>9:16</span>
              <Sparkle size={29}/>
              <strong>GO<br/>LIVE.</strong>
              <span>YOUR NAME</span>
            </div>
            <span className="floating-label"><Check size={14}/> Tudo conversa. Tudo combina.</span>
          </div>

          {/* Copy com fade-right */}
          <div className="pack-copy" data-reveal="right">
            <span className="eyebrow">UM PACK. SUA LIVE INTEIRA.</span>
            <h2>Não é só um overlay.<br/>É o seu universo visual.</h2>
            <p>Da primeira contagem regressiva ao último "valeu, chat!". Cada detalhe com a mesma identidade.</p>
            <div className="included-list">
              {packItems.map((x, i) => (
                <span key={x} data-reveal data-reveal-delay={String(200 + i * 60)}><Check size={16}/>{x}</span>
              ))}
            </div>
            <div className="pack-formats">
              <span><MonitorPlay size={18}/> Horizontal 16:9</span>
              <span><DeviceMobile size={18}/> Vertical 9:16</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section className="pricing-section section-space" id="pacotes">
        <div className="shell">
          <div className="center-heading" data-reveal>
            <span className="eyebrow">SEU ESTILO. SEU MOMENTO.</span>
            <h2>Um upgrade na live.<br/>Sem um downgrade no bolso.</h2>
            <p>Pagamento único. Seu pack pra chamar de seu.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((p, i) => (
              <article
                className={`price-card ${p.id === "ai" ? "featured" : ""}`}
                key={p.id}
                data-reveal
                data-reveal-delay={String(i * 110)}
              >
                {p.id === "ai" && <span className="popular-label"><Sparkle size={13} weight="fill"/> FEITO SÓ PRA VOCÊ</span>}
                <h3>{p.name}{p.id === "ai" && <Sparkle size={24} weight="fill"/>}</h3>
                <p>{p.tagline}</p>
                <div className="price-amount">
                  <span>R$</span>{p.price}<span>,90</span><small>/ pacote</small>
                </div>
                <button
                  className={p.id === "ai" ? "button-primary" : "button-secondary"}
                  onClick={() => setPlan(p.id)}
                >
                  {p.cta}<ArrowUpRight size={17}/>
                </button>
                <div className="price-divider"/>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}><Check size={16}/>{f}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="payment-note" data-reveal>
            <ShieldCheck size={18}/><span>Pagamento seguro com Mercado Pago</span>
            <i/> Pix e cartão de crédito <i/> Sem mensalidades
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="faq-section section-space" id="faq">
        <div className="shell faq-layout">
          <div data-reveal="left">
            <span className="eyebrow">ANTES DE DAR O PLAY</span>
            <h2>A gente responde.<br/>Você fica tranquilo.</h2>
            <p>As dúvidas mais comuns de quem<br/>está prestes a subir de nível.</p>
            <a href="/guia-obs" className="text-link">Veja o guia de instalação no OBS <ArrowUpRight size={17}/></a>
          </div>
          <div className="faq-list" data-reveal="right" data-reveal-delay="80">
            {faqs.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}<Plus size={19}/></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section className="closing-section">
        <div className="shell closing-inner">
          <div data-reveal>
            <span className="eyebrow"><span className="status-dot"/> SEU PRÓXIMO CAPÍTULO ESTÁ ONLINE</span>
            <h2>Seu conteúdo já é único.<br/>Seu overlay também pode ser.</h2>
          </div>
          <a className="button-primary" href="#criar" data-reveal="scale" data-reveal-delay="150">
            <Sparkle size={18} weight="fill"/> Bora criar o meu <ArrowRight size={19}/>
          </a>
        </div>
      </section>

      {plan && <CheckoutModal plan={plan} onClose={() => setPlan(null)}/>}
    </>
  );
}
