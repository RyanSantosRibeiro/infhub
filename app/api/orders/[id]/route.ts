import { StoreError, type Order } from "@/lib/server/commerce";
import { DELIVERY_BUCKET } from "@/lib/server/config";
import { storeDatabase } from "@/lib/server/database";
import { apiError, json } from "@/lib/server/http";
import { equalSecret, hashSecret } from "@/lib/server/security";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id) || !/^[\da-f]{64}$/i.test(token)) throw new StoreError("Pedido não encontrado ou link inválido.", 404);
    const db = storeDatabase();
    const { data, error } = await db.from("overlay_orders").select("id,plan,status,access_token_hash,download_path,failure_code,payment_status").eq("id", id).maybeSingle();
    if (error) throw new StoreError("Não foi possível consultar seu pedido agora.", 503);
    const order = data as Order | null;
    if (!order || !equalSecret(hashSecret(token), order.access_token_hash)) throw new StoreError("Pedido não encontrado ou link inválido.", 404);
    let downloadUrl: string | undefined;
    if (order.status === "ready" && order.download_path && order.payment_status === "approved") {
      const { data: signed, error: signError } = await db.storage.from(DELIVERY_BUCKET).createSignedUrl(order.download_path, 300, { download: `overlays-${order.plan}.zip` });
      if (signError) throw new StoreError("Seu pacote está pronto, mas o download está temporariamente indisponível. Atualize a página.", 503);
      downloadUrl = signed.signedUrl;
    }
    const errorMessage = order.failure_code === "payment_reversed"
      ? "O pagamento foi estornado ou contestado. O download foi suspenso."
      : order.failure_code === "generation_failed"
        ? "Recebemos seu pagamento, mas a geração precisa de atenção. Guarde o número deste pedido e entre em contato com a loja."
        : order.status === "failed" ? "Não foi possível concluir este pedido. Você pode iniciar uma nova compra." : undefined;
    return json({ id: order.id, status: order.status, plan: order.plan, downloadUrl, error: errorMessage });
  } catch (error) { return apiError(error); }
}
