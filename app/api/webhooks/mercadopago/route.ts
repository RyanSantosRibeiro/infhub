import { after } from "next/server";
import { StoreError, type Order } from "@/lib/server/commerce";
import { storeConfig } from "@/lib/server/config";
import { storeDatabase } from "@/lib/server/database";
import { processGenerationJob } from "@/lib/server/generation";
import { apiError, json, readJson } from "@/lib/server/http";
import { fetchPayment } from "@/lib/server/mercadopago";
import { paymentMatchesOrder, verifyMercadoPagoSignature } from "@/lib/server/security";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const config = storeConfig();
    // Validate the signed query ID, never a body-only ID or user-supplied resource URL.
    const dataId = new URL(request.url).searchParams.get("data.id");
    if (!verifyMercadoPagoSignature({ signature: request.headers.get("x-signature"), requestId: request.headers.get("x-request-id"), dataId, secret: config.webhookSecret })) throw new StoreError("Assinatura inválida.", 401);
    const payload = await readJson(request) as { type?: string; data?: { id?: string | number } };
    if (payload.type !== "payment") return json({ received: true });
    if (!payload.data?.id || String(payload.data.id) !== dataId) throw new StoreError("Identificador inválido.", 400);
    const payment = await fetchPayment(dataId!);
    if (String(payment.id) !== dataId) throw new StoreError("Pagamento inválido.", 400);
    if (!/^[\da-f-]{36}$/i.test(payment.external_reference || "")) return json({ received: true });
    const db = storeDatabase();
    const { data, error } = await db.from("overlay_orders").select("id,amount_cents,payment_id,status").eq("id", payment.external_reference).maybeSingle();
    if (error) throw new StoreError("Não foi possível registrar a notificação.", 503);
    if (!data) return json({ received: true });
    const order = data as Order;
    if (!paymentMatchesOrder(payment, order, config.collectorId, config.production)) throw new StoreError("Pagamento não corresponde ao pedido.", 400);
    if (payment.status === "approved") {
      const { data: approved, error: approvalError } = await db.rpc("overlay_approve_payment", { p_order_id: order.id, p_payment_id: dataId, p_amount_cents: order.amount_cents });
      if (approvalError) throw new StoreError("Não foi possível confirmar o pagamento.", 503);
      if (!approved) throw new StoreError("Pagamento duplicado ou divergente.", 409);
      // The durable SQL job exists before acknowledging the webhook. Cron recovers interruptions.
      after(async () => { await processGenerationJob(order.id).catch(() => console.error("Overlay worker deferred to scheduled retry")); });
    } else if (["refunded", "charged_back", "cancelled"].includes(payment.status)) {
      const { error: revokeError } = await db.rpc("overlay_revoke_payment", { p_order_id: order.id, p_payment_id: dataId, p_status: payment.status });
      if (revokeError) throw new StoreError("Não foi possível atualizar o pagamento.", 503);
    }
    return json({ received: true });
  } catch (error) { return apiError(error); }
}
