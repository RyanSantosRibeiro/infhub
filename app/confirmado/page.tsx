import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderStatus } from "@/app/components/store/order-status";

export const metadata: Metadata = {
  title: "Seu pedido | FRAME",
  description: "Acompanhe o pagamento e baixe seu pacote de overlays FRAME.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function ConfirmedPage() {
  return (
    <main className="order-page">
      <Suspense fallback={<div className="order-panel"><p className="checkout-eyebrow">FRAME</p><h1>Preparando seu pedido...</h1></div>}>
        <OrderStatus />
      </Suspense>
    </main>
  );
}
