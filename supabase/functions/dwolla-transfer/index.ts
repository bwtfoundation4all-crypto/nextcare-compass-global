// Supabase Edge Function: dwolla-transfer
// Initiates an ACH transfer from a customer's verified funding source to the platform's master funding source

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransferBody {
  amountCents: number;
  sourceFundingSourceId?: string; // optional; if omitted, try pulling from invoice or prompt caller to provide it
  idempotencyKey?: string;
  note?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing Authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const DWOLLA_KEY = Deno.env.get("DWOLLA_KEY")!;
    const DWOLLA_SECRET = Deno.env.get("DWOLLA_SECRET")!;
    const DWOLLA_ENV = (Deno.env.get("DWOLLA_ENV") || "sandbox").toLowerCase();
    const MASTER_FS = Deno.env.get("DWOLLA_MASTER_FUNDING_SOURCE");
    if (!MASTER_FS) return new Response(JSON.stringify({ error: "Missing DWOLLA_MASTER_FUNDING_SOURCE secret" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const base = DWOLLA_ENV === "production" ? "https://api.dwolla.com" : "https://api-sandbox.dwolla.com";

    const body = (await req.json()) as TransferBody;
    if (!body?.amountCents || body.amountCents <= 0) return new Response(JSON.stringify({ error: "amountCents is required and must be > 0" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Token
    const tokenRes = await fetch(`${base}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${btoa(`${DWOLLA_KEY}:${DWOLLA_SECRET}`)}` },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });
    if (!tokenRes.ok) throw new Error(`Token error: ${tokenRes.status} ${await tokenRes.text()}`);
    const { access_token } = await tokenRes.json();

    const sourceFundingSourceId = body.sourceFundingSourceId;
    if (!sourceFundingSourceId) {
      return new Response(JSON.stringify({ error: "sourceFundingSourceId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const amount = (body.amountCents / 100).toFixed(2);

    const transferPayload = {
      _links: {
        source: { href: `${base}/funding-sources/${sourceFundingSourceId}` },
        destination: { href: `${base}/funding-sources/${MASTER_FS}` },
      },
      amount: { currency: "USD", value: amount },
      metadata: body.note ? { note: body.note } : undefined,
    } as Record<string, unknown>;

    const headers: HeadersInit = {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.dwolla.v1.hal+json",
      "Content-Type": "application/json",
    };
    if (body.idempotencyKey) headers["Idempotency-Key"] = body.idempotencyKey;

    const resTr = await fetch(`${base}/transfers`, { method: "POST", headers, body: JSON.stringify(transferPayload) });
    if (!resTr.ok) throw new Error(`Dwolla transfer failed: ${resTr.status} ${await resTr.text()}`);

    const location = resTr.headers.get("Location");
    const transferId = location?.split("/").pop();

    return new Response(JSON.stringify({ transferId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("dwolla-transfer error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});