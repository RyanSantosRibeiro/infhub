"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, CircleNotch, LockKey, Sparkle, X } from "@phosphor-icons/react";
import "./quiz.css";

export type OverlayPlan = "ready" | "custom" | "ai";
export type OverlayBrief = {
  category: string;
  platform: string;
  style: string;
  colors: string;
  name: string;
  handle: string;
  webcam: string;
  elements: string[];
  scenes: string[];
  animation: string;
  references: string;
};

type CheckoutModalProps = {
  plan: OverlayPlan;
  templateId?: string;
  templateName?: string;
  brief?: OverlayBrief;
  initialEmail?: string;
  onClose: () => void;
};

const planDetails = {
  ready: { name: "Ready", price: "29,90", description: "Modelo pronto com seu nome e @" },
  custom: { name: "Custom", price: "59,90", description: "Um modelo com a sua identidade" },
  ai: { name: "AI Custom", price: "99,90", description: "Seu universo visual criado com IA" },
};

export function CheckoutModal({ plan, templateId, templateName, brief, initialEmail = "", onClose }: CheckoutModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [name, setName] = useState(brief?.name ?? "");
  const [handle, setHandle] = useState(brief?.handle ?? "");
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const details = planDetails[plan];

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      requestRef.current?.abort();
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          plan,
          email: email.trim(),
          ...(templateId ? { templateId } : {}),
          brief: {
            category: brief?.category ?? "Gaming",
            platform: brief?.platform ?? "YouTube",
            style: brief?.style ?? "Neon",
            colors: brief?.colors ?? "",
            name: name.trim(),
            handle: handle.trim(),
            webcam: brief?.webcam ?? "Sem webcam",
            elements: brief?.elements ?? [],
            scenes: brief?.scenes ?? [],
            animation: brief?.animation ?? "Intermediária",
            references: brief?.references ?? "",
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível abrir o checkout. Tente novamente.");
      if (typeof result.url !== "string") throw new Error("O checkout não retornou um endereço válido. Tente novamente.");
      const url = new URL(result.url);
      if (url.protocol !== "https:") throw new Error("Não foi possível abrir uma conexão segura com o pagamento.");
      window.location.assign(url.href);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setError(caught instanceof Error ? caught.message : "Não foi possível conectar. Confira sua internet e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="checkout-dialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <button type="button" className="checkout-close" onClick={onClose} aria-label="Fechar checkout"><X size={21} /></button>
      <span className="checkout-icon"><Sparkle size={25} weight="fill" /></span>
      <p className="checkout-eyebrow">QUASE NO AR</p>
      <h2 id={`${id}-title`}>Só falta dar o play.</h2>
      <p id={`${id}-description`} className="checkout-description">Confira seus dados e leve sua live para outro nível.</p>
      <div className="checkout-summary">
        <div><strong>{details.name} {plan === "ai" && <Sparkle size={14} weight="fill" />}</strong><span>{templateName ?? details.description}</span></div>
        <p><small>R$</small> {details.price}<span>pagamento único</span></p>
      </div>
      <form onSubmit={checkout} className="checkout-form">
        <div className="quiz-fields">
          <label htmlFor={`${id}-name`}>Nome do canal<input id={`${id}-name`} value={name} onChange={(event) => setName(event.target.value)} required maxLength={60} pattern=".*\S.*" placeholder="Seu nome em destaque" autoComplete="nickname" /></label>
          <label htmlFor={`${id}-handle`}>Seu @ <span>opcional</span><input id={`${id}-handle`} value={handle} onChange={(event) => setHandle(event.target.value)} maxLength={80} placeholder="@seucanal" autoComplete="off" /></label>
          <label htmlFor={`${id}-email`}>E-mail do pedido<input id={`${id}-email`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} placeholder="voce@email.com" autoComplete="email" /></label>
        </div>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="quiz-primary checkout-submit" type="submit" disabled={loading}>
          {loading ? <><CircleNotch size={20} className="quiz-spin" /> Preparando checkout...</> : <>Ir para o pagamento <ArrowRight size={19} weight="bold" /></>}
        </button>
        <p className="checkout-trust"><LockKey size={13} /> Pagamento via Mercado Pago</p>
        <p className="checkout-payment-note"><Check size={13} /> Seu pedido será gerado após a aprovação do pagamento.</p>
      </form>
    </dialog>
  );
}
