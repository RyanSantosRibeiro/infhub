import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { validateCheckout, PLAN_PRICES, escapeHtml } from "./commerce.ts";
import { verifyMercadoPagoSignature, paymentMatchesOrder, equalSecret, hashSecret } from "./security.ts";

const secret = "test-only-webhook-key";
const dataId = "123456789";
const requestId = "test-request";
const ts = "1781009491";
const digest = createHmac("sha256", secret).update(`id:${dataId};request-id:${requestId};ts:${ts};`).digest("hex");
const signed = { signature: `ts=${ts},v1=${digest}`, requestId, dataId, secret };

test("accepts an authentic notification, including a delayed retry", () => {
  assert.equal(verifyMercadoPagoSignature(signed), true);
});
test("rejects forged signatures and a substituted resource ID", () => {
  assert.equal(verifyMercadoPagoSignature({ ...signed, signature: `ts=${ts},v1=${"0".repeat(64)}` }), false);
  assert.equal(verifyMercadoPagoSignature({ ...signed, dataId: "987654321" }), false);
  assert.equal(verifyMercadoPagoSignature({ ...signed, secret: "another-key" }), false);
});
test("rejects unsigned body-only IDs and malformed headers", () => {
  assert.equal(verifyMercadoPagoSignature({ ...signed, dataId: null }), false);
  assert.equal(verifyMercadoPagoSignature({ ...signed, requestId: null }), false);
  assert.equal(verifyMercadoPagoSignature({ ...signed, signature: `ts=${ts},ts=${ts},v1=${digest}` }), false);
  assert.equal(verifyMercadoPagoSignature({ ...signed, signature: `ts=${ts},v1=bad` }), false);
});

const order = { id: "a1f925df-36d7-4692-8bb1-374f21a81abc", amount_cents: 5990 };
const payment = { id: "123", status: "approved", external_reference: order.id, transaction_amount: 59.9, currency_id: "BRL", collector_id: 12345, live_mode: false };
test("only matches the exact merchant, amount, currency, order and environment", () => {
  assert.equal(paymentMatchesOrder(payment, order, "12345", false), true);
  for (const patch of [{ transaction_amount: 29.9 }, { transaction_amount: NaN }, { currency_id: "USD" }, { collector_id: 54321 }, { external_reference: "other" }, { live_mode: true }]) {
    assert.equal(paymentMatchesOrder({ ...payment, ...patch }, order, "12345", false), false);
  }
});
test("uses server prices, validates identity, and ignores a client price", () => {
  const result = validateCheckout({ plan: "ai", price: 1, email: "  Stream@example.com ", brief: { category: "Gaming", style: "Neon", name: "My channel", handle: "@stream" } });
  assert.equal(result.email, "stream@example.com");
  assert.equal(PLAN_PRICES[result.plan], 9990);
  assert.equal(result.price, undefined);
});
test("rejects invalid plans, oversized prompts and CSS injection", () => {
  const valid = { plan: "custom", email: "a@example.com", brief: { category: "Gaming", style: "Neon", name: "Channel" } };
  assert.throws(() => validateCheckout({ ...valid, plan: "__proto__" }));
  assert.throws(() => validateCheckout({ ...valid, email: "invalid" }));
  assert.throws(() => validateCheckout({ ...valid, brief: { ...valid.brief, notes: "x".repeat(601) } }));
  assert.throws(() => validateCheckout({ ...valid, brief: { ...valid.brief, colors: ["red; background:url(evil)"] } }));
  assert.equal(validateCheckout(valid).brief.handle, "");
});
test("escapes purchased HTML text and uses constant-time secret comparison", () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  assert.equal(equalSecret("private-token", "private-token"), true);
  assert.equal(equalSecret("private-token", "another"), false);
  assert.equal(hashSecret("private-token").length, 64);
});
