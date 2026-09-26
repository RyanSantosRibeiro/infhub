import "server-only";
import { StoreError, type Plan } from "./commerce";

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new StoreError("O checkout ainda está sendo preparado. Nenhuma cobrança foi criada. Tente novamente em breve.", 503, "missing_configuration");
  return value;
}

export function storeConfig(plan?: Plan) {
  const appUrl = new URL(requiredEnv("APP_URL"));
  if (appUrl.protocol !== "https:" || appUrl.pathname !== "/" || appUrl.search || appUrl.hash || appUrl.username) {
    throw new StoreError("O checkout precisa de um endereço HTTPS configurado.", 503, "invalid_configuration");
  }
  const environment = process.env.MERCADOPAGO_ENVIRONMENT || "sandbox";
  if (!["sandbox", "production"].includes(environment)) throw new StoreError("Configuração de pagamento indisponível.", 503, "invalid_configuration");
  const config = {
    appUrl: appUrl.origin,
    accessToken: requiredEnv("MERCADOPAGO_ACCESS_TOKEN"),
    webhookSecret: requiredEnv("MERCADOPAGO_WEBHOOK_SECRET"),
    collectorId: requiredEnv("MERCADOPAGO_COLLECTOR_ID"),
    production: environment === "production",
  };
  requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  requiredEnv("GENERATION_JOB_SECRET");
  if (plan === "ai") {
    if (!process.env.OPENAI_API_KEY?.trim()) throw new StoreError("O AI Custom estará disponível em breve. Você já pode escolher Ready ou Custom.", 503, "ai_unavailable");
  }
  return config;
}

export const DELIVERY_BUCKET = "overlay-deliveries";
