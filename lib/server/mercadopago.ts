import "server-only";
import { StoreError, PLAN_PRICES, type CheckoutInput } from "./commerce";
import { storeConfig } from "./config";
import type { Payment } from "./security";

async function mercadoPago<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new StoreError("O Mercado Pago está indisponível no momento. Tente novamente.", 502, "payment_provider_error");
  return response.json() as Promise<T>;
}

export async function createPreference(orderId: string, accessToken: string, input: CheckoutInput) {
  const config = storeConfig(input.plan);
  const returnUrl = new URL("/confirmado", config.appUrl);
  returnUrl.searchParams.set("order", orderId);
  returnUrl.searchParams.set("token", accessToken);
  const titles = { ready: "Ready", custom: "Custom", ai: "AI Custom" };
  const preference = await mercadoPago<{ id: string; init_point: string; sandbox_init_point: string }>("/checkout/preferences", config.accessToken, {
    method: "POST",
    headers: { "X-Idempotency-Key": orderId },
    body: JSON.stringify({
      items: [{ id: input.plan, title: `Overlays OBS · ${titles[input.plan]}`, quantity: 1, unit_price: PLAN_PRICES[input.plan] / 100, currency_id: "BRL" }],
      payer: { email: input.email },
      external_reference: orderId,
      back_urls: { success: returnUrl.href, failure: returnUrl.href, pending: returnUrl.href },
      auto_return: "approved",
      notification_url: `${config.appUrl}/api/webhooks/mercadopago?source_news=webhooks`,
      statement_descriptor: "OVERLAY STORE",
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }),
  });
  const checkoutUrl = config.production ? preference.init_point : preference.sandbox_init_point;
  if (!checkoutUrl || !preference.id) throw new StoreError("Não foi possível abrir o pagamento.", 502, "invalid_preference");
  const parsed = new URL(checkoutUrl);
  if (parsed.protocol !== "https:" || !/(^|\.)mercadopago\.com(\.br)?$/.test(parsed.hostname)) throw new StoreError("Endereço do checkout inválido.", 502, "invalid_preference");
  return { id: preference.id, url: parsed.href };
}

export function fetchPayment(paymentId: string) {
  const config = storeConfig();
  return mercadoPago<Payment>(`/v1/payments/${encodeURIComponent(paymentId)}`, config.accessToken);
}
