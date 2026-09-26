import { randomBytes, randomUUID } from "node:crypto";
import { PLAN_PRICES, StoreError, validateCheckout } from "@/lib/server/commerce";
import { storeConfig } from "@/lib/server/config";
import { storeDatabase } from "@/lib/server/database";
import { apiError, json, readJson } from "@/lib/server/http";
import { createPreference } from "@/lib/server/mercadopago";
import { hashSecret } from "@/lib/server/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = validateCheckout(await readJson(request));
    const config = storeConfig(input.plan);
    const origin = request.headers.get("origin");
    if (origin && origin !== config.appUrl) throw new StoreError("Origem do pedido não autorizada.", 403);
    const db = storeDatabase();
    const { data: allowed, error: limitError } = await db.rpc("overlay_allow_checkout", { p_key: hashSecret(input.email), p_limit: 5 });
    if (limitError) throw new StoreError("O checkout ainda está sendo preparado. Tente novamente em breve.", 503, "database_unavailable");
    if (!allowed) throw new StoreError("Você tentou algumas vezes. Aguarde 10 minutos antes de criar outro pedido.", 429);
    const id = randomUUID();
    const token = randomBytes(32).toString("hex");
    const { error: insertError } = await db.from("overlay_orders").insert({
      id, email: input.email, plan: input.plan, amount_cents: PLAN_PRICES[input.plan],
      brief: input.brief, template_id: input.templateId || null, access_token_hash: hashSecret(token),
    });
    if (insertError) throw new StoreError("Não foi possível registrar seu pedido. Nenhuma cobrança foi criada.", 503, "order_create_failed");
    try {
      const preference = await createPreference(id, token, input);
      const { error } = await db.from("overlay_orders").update({ preference_id: preference.id }).eq("id", id);
      if (error) throw new StoreError("Não foi possível salvar seu checkout. Tente novamente.", 503, "preference_save_failed");
      return json({ url: preference.url, checkoutUrl: preference.url });
    } catch (error) {
      await db.from("overlay_orders").update({ status: "failed", failure_code: "checkout_failed" }).eq("id", id).eq("status", "pending");
      throw error;
    }
  } catch (error) { return apiError(error); }
}
