import { requiredEnv } from "@/lib/server/config";
import { StoreError } from "@/lib/server/commerce";
import { processGenerationJob } from "@/lib/server/generation";
import { apiError, json } from "@/lib/server/http";
import { equalSecret } from "@/lib/server/security";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization") || "";
    if (!equalSecret(token, `Bearer ${requiredEnv("GENERATION_JOB_SECRET")}`)) throw new StoreError("Não autorizado.", 401);
    const result = await processGenerationJob();
    return json(result);
  } catch (error) { return apiError(error); }
}

// GET allows managed cron providers to use the same Authorization header.
export const GET = POST;
