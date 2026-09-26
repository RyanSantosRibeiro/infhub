"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CircleNotch, DownloadSimple, Package, Sparkle, WarningCircle } from "@phosphor-icons/react";
import "./quiz.css";

type Order = {
  id: string;
  status: "pending" | "paid" | "generating" | "ready" | "failed";
  plan: "ready" | "custom" | "ai";
  downloadUrl?: string;
  error?: string;
};

const statusCopy = {
  pending: { title: "Aguardando o sinal verde.", text: "Assim que o Mercado Pago confirmar o pagamento, começamos a preparar seu pacote. Esta página atualiza automaticamente." },
  paid: { title: "Seu novo visual está nascendo.", text: "Pagamento confirmado! Estamos preparando os arquivos para a sua próxima live." },
  generating: { title: "Seu novo visual está nascendo.", text: "Estamos criando seu pacote. Você pode deixar esta página aberta enquanto tudo fica pronto." },
  ready: { title: "Pronto para entrar em cena.", text: "Seu pacote está pronto. Baixe os arquivos, siga o guia de instalação e dê o play na sua próxima live." },
  failed: { title: "Algo interrompeu o processo.", text: "Não foi possível concluir seu pedido. Guarde o número abaixo para consultar o atendimento." },
};

function safeDownloadUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function OrderStatus() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const token = searchParams.get("token");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!orderId || !token) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();

    async function refresh() {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId!)}?token=${encodeURIComponent(token!)}`, {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não conseguimos consultar seu pedido agora.");
        if (!active) return;
        if (!Object.prototype.hasOwnProperty.call(statusCopy, result.status) || result.id !== orderId) {
          throw new Error("A resposta do pedido não pôde ser validada. Tente consultar novamente.");
        }
        setOrder(result as Order);
        setError("");
        if (result.status !== "ready" && result.status !== "failed") timer = setTimeout(refresh, 5000);
      } catch (caught) {
        if (!active || controller.signal.aborted) return;
        setError(caught instanceof Error ? caught.message : "Confira sua conexão e tente novamente.");
      }
    }

    void refresh();
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [orderId, token, retry]);

  if (!orderId || !token) {
    return (
      <div className="order-panel">
        <span className="order-symbol"><Package size={34} /></span>
        <p className="checkout-eyebrow">SEU PEDIDO</p>
        <h1>Vamos encontrar seu pacote.</h1>
        <p className="order-description">Abra o link completo recebido ao finalizar seu checkout para acompanhar o pagamento e baixar seus overlays.</p>
        <Link href="/" className="quiz-primary order-primary">Voltar para a loja <ArrowRight size={19} /></Link>
      </div>
    );
  }

  const status = order?.status;
  const copy = status ? statusCopy[status] : null;
  const downloadUrl = status === "ready" ? safeDownloadUrl(order?.downloadUrl) : null;
  const progress = status === "ready" ? 3 : status === "paid" || status === "generating" ? 1 : 0;

  return (
    <div className="order-panel">
      <span className={`order-symbol ${status === "failed" ? "has-error" : ""}`}>
        {status === "ready" ? <Check size={36} weight="bold" /> : status === "failed" ? <WarningCircle size={36} /> : <Sparkle size={35} weight="fill" />}
      </span>
      <p className="checkout-eyebrow">SEU PRÓXIMO LEVEL ESTÁ AQUI</p>
      <div aria-live="polite">
        <h1>{copy?.title ?? (error ? "Vamos tentar de novo." : "Consultando seu pedido...")}</h1>
        <p className="order-description">{copy?.text ?? "Estamos conferindo os detalhes do seu pedido com segurança."}</p>
      </div>
      {order && status !== "failed" && (
        <ol className="order-steps" aria-label="Progresso do pedido">
          {["Pagamento aprovado", "Preparando seu pacote", "Pronto para baixar"].map((label, index) => (
            <li key={label} className={index < progress ? "is-done" : index === progress ? "is-current" : ""}>
              <span>{index < progress ? <Check size={15} weight="bold" /> : index === progress ? <CircleNotch size={17} className="quiz-spin" /> : index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      )}
      {(error || order?.error) && <p role="alert" className="checkout-error">{error || order?.error}</p>}
      {!order && !error && <CircleNotch className="quiz-spin order-loading" size={27} aria-label="Carregando" />}
      {error && <button type="button" className="quiz-primary order-primary" onClick={() => { setError(""); setRetry((value) => value + 1); }}>Consultar novamente <ArrowRight size={19} /></button>}
      {downloadUrl && <a className="quiz-primary order-primary" href={downloadUrl} rel="noreferrer"><DownloadSimple size={21} weight="bold" /> Baixar meu pacote</a>}
      {status === "ready" && !downloadUrl && <p className="checkout-error">Seu pacote foi preparado, mas o link de download está indisponível. Atualize esta página para consultar novamente.</p>}
      <div className="order-receipt">
        <span>Pedido <strong>{orderId}</strong></span>
        {order && <span>Pacote <strong>{order.plan === "ai" ? "AI Custom" : order.plan === "custom" ? "Custom" : "Ready"}</strong></span>}
      </div>
      <p className="order-note">Salve o endereço desta página para acessar seu pedido depois. O link é pessoal; não compartilhe.</p>
      <Link href="/" className="order-return"><ArrowLeft size={16} /> Voltar para a loja</Link>
    </div>
  );
}
