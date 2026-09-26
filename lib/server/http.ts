import { StoreError } from "./commerce";

export function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" } });
}

export function apiError(error: unknown) {
  if (error instanceof StoreError) return json({ error: error.message }, error.status);
  // Never serialize provider errors, request URLs, emails, tokens or environment values.
  console.error("Overlay store request failed", error instanceof Error ? error.name : "unknown");
  return json({ error: "Não foi possível concluir agora. Tente novamente em alguns instantes." }, 500);
}

export async function readJson(request: Request, maximumBytes = 16_384): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new StoreError("Envie os dados em JSON.", 415);
  if (Number(request.headers.get("content-length") || 0) > maximumBytes) throw new StoreError("Pedido muito grande.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new StoreError("Dados ausentes.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maximumBytes) { await reader.cancel(); throw new StoreError("Pedido muito grande.", 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new StoreError("JSON inválido."); }
}
