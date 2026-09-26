export const PLAN_PRICES = { ready: 2990, custom: 5990, ai: 9990 } as const;
export type Plan = keyof typeof PLAN_PRICES;
export type Brief = {
  category: string;
  style: string;
  name: string;
  handle: string;
  colors?: string[];
  notes?: string;
};
export type CheckoutInput = { plan: Plan; email: string; brief: Brief; templateId?: string };
export type Order = {
  id: string;
  plan: Plan;
  amount_cents: number;
  brief: Brief;
  template_id: string | null;
  status: "pending" | "paid" | "generating" | "ready" | "failed";
  access_token_hash: string;
  payment_id: string | null;
  payment_status: string | null;
  download_path: string | null;
  failure_code: string | null;
};

export class StoreError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(message: string, status = 400, code = "invalid_request") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function field(value: unknown, label: string, max: number, required = true): string {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) {
    if (!required && value === undefined) return "";
    throw new StoreError(`Confira o campo ${label}.`);
  }
  return value.trim();
}

export function validateCheckout(value: unknown): CheckoutInput {
  if (!value || typeof value !== "object") throw new StoreError("Dados do pedido inválidos.");
  const input = value as Record<string, unknown>;
  if (typeof input.plan !== "string" || !Object.hasOwn(PLAN_PRICES, input.plan)) {
    throw new StoreError("Escolha um pacote válido.");
  }
  const email = field(input.email, "e-mail", 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new StoreError("Informe um e-mail válido.");
  if (!input.brief || typeof input.brief !== "object") throw new StoreError("Preencha seu briefing.");
  const source = input.brief as Record<string, unknown>;
  const brief: Brief = {
    category: field(source.category, "conteúdo", 60),
    style: field(source.style, "estilo", 60),
    name: field(source.name, "nome do canal", 40),
    handle: field(source.handle, "@ do canal", 60, false),
  };
  if (source.colors !== undefined) {
    if (!Array.isArray(source.colors) || source.colors.length > 3 || source.colors.some((color) => typeof color !== "string" || !/^#[\da-f]{6}$/i.test(color))) {
      throw new StoreError("Use até três cores no formato hexadecimal.");
    }
    brief.colors = source.colors as string[];
  }
  if (source.notes !== undefined) brief.notes = field(source.notes, "observações", 600, false);
  let templateId: string | undefined;
  if (input.templateId !== undefined) {
    templateId = field(input.templateId, "modelo", 60);
    if (!/^[a-z0-9-]+$/.test(templateId)) throw new StoreError("Modelo inválido.");
  }
  return { plan: input.plan as Plan, email, brief, templateId };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
