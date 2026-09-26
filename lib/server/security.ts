import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function equalSecret(actual: string, expected: string): boolean {
  const left = Buffer.from(hashSecret(actual), "hex");
  const right = Buffer.from(hashSecret(expected), "hex");
  return timingSafeEqual(left, right);
}

export function verifyMercadoPagoSignature(input: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
  secret: string;
}): boolean {
  if (!input.signature || !input.requestId || !input.dataId || !input.secret) return false;
  if (input.signature.length > 1000 || input.requestId.length > 200 || !/^\d{1,30}$/.test(input.dataId)) return false;
  const parts = input.signature.split(",").map((part) => part.trim().split("="));
  const timestamps = parts.filter(([key]) => key === "ts").map(([, value]) => value);
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (timestamps.length !== 1 || !/^\d{10,13}$/.test(timestamps[0])) return false;
  // Authentic retries may arrive late. Replay protection is the atomic payment ID + job uniqueness,
  // not a wall-clock cutoff that could discard a legitimate delayed payment notification.
  const manifest = `id:${input.dataId.toLowerCase()};request-id:${input.requestId};ts:${timestamps[0]};`;
  const expected = createHmac("sha256", input.secret).update(manifest).digest();
  return signatures.some((signature) => /^[a-f0-9]{64}$/i.test(signature) && timingSafeEqual(expected, Buffer.from(signature, "hex")));
}

export type Payment = {
  id: number | string;
  status: string;
  external_reference: string;
  transaction_amount: number;
  currency_id: string;
  collector_id: number | string;
  live_mode: boolean;
};

export function paymentMatchesOrder(payment: Payment, order: { id: string; amount_cents: number }, collectorId: string, production: boolean) {
  return payment.external_reference === order.id && payment.currency_id === "BRL"
    && typeof payment.transaction_amount === "number" && Number.isFinite(payment.transaction_amount)
    && Math.round(payment.transaction_amount * 100) === order.amount_cents
    && String(payment.collector_id) === collectorId && payment.live_mode === production;
}
