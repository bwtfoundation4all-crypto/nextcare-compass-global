// Supabase Edge Function: dwolla-create-and-verify-funding-source
// Creates a test bank funding source for a Dwolla customer and auto-verifies it in Sandbox via micro-deposits

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateBody {
  accountNumber?: string;
  routingNumber?: string;
  bankAccountType?: "checking" | "savings";
  nickname?: string;
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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: profile } = await supabase.from("profiles").select("dwolla_customer_id").eq("user_id", user.id).maybeSingle();
    if (!profile?.dwolla_customer_id) return new Response(JSON.stringify({ error: "No Dwolla customer. Call dwolla-create-customer first." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const base = DWOLLA_ENV === "production" ? "https://api.dwolla.com" : "https://api-sandbox.dwolla.com";

    // Get token
    const tokenRes = await fetch(`${base}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${btoa(`${DWOLLA_KEY}:${DWOLLA_SECRET}`)}` },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });
    if (!tokenRes.ok) throw new Error(`Token error: ${tokenRes.status} ${await tokenRes.text()}`);
    const { access_token } = await tokenRes.json();

    const body = (await req.json().catch(() => ({}))) as CreateBody;
    const accountNumber = body.accountNumber || "123456789"; // Sandbox test
    const routingNumber = body.routingNumber || "222222226"; // Sandbox test routing
    const bankAccountType = body.bankAccountType || "checking";
    const nickname = body.nickname || "Sandbox Checking";

    // Create funding source
    const createFsRes = await fetch(`${base}/customers/${profile.dwolla_customer_id}/funding-sources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.dwolla.v1.hal+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routingNumber,
        accountNumber,
        bankAccountType,
        name: nickname,
      }),
    });
    if (!createFsRes.ok) throw new Error(`Create FS failed: ${createFsRes.status} ${await createFsRes.text()}`);
    const fsLocation = createFsRes.headers.get("Location");
    if (!fsLocation) throw new Error("Missing funding source Location");
    const fsId = fsLocation.split("/").pop();

    // Initiate micro-deposits
    const mdRes = await fetch(`${base}/funding-sources/${fsId}/micro-deposits`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, Accept: "application/vnd.dwolla.v1.hal+json" },
    });
    if (!mdRes.ok) throw new Error(`Micro-deposits start failed: ${mdRes.status} ${await mdRes.text()}`);

    // Verify micro-deposits in sandbox (always 0.01 & 0.01)
    const verifyRes = await fetch(`${base}/funding-sources/${fsId}/micro-deposits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.dwolla.v1.hal+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount1: { value: "0.01", currency: "USD" }, amount2: { value: "0.01", currency: "USD" } }),
    });
    if (!verifyRes.ok) throw new Error(`Micro-deposits verify failed: ${verifyRes.status} ${await verifyRes.text()}`);

    return new Response(JSON.stringify({ fundingSourceId: fsId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("dwolla-create-and-verify-funding-source error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});