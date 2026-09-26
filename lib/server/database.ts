import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requiredEnv } from "./config";

export function storeDatabase() {
  return createClient(requiredEnv("NEXT_PUBLIC_SUPABASE_URL"), requiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, init) => fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(15_000) }) },
  });
}
