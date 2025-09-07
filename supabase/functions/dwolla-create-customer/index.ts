// Supabase Edge Function: dwolla-create-customer
// Creates (or returns existing) Dwolla Customer for the authenticated user and saves it to profiles.dwolla_customer_id

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DwollaTokenResponse { access_token: string; expires_in: number; token_type: string; }

async function getDwollaToken(env: string, key: string, secret: string): Promise<string> {
  const base = env === "production" ? "https://api.dwolla.com" : "https://api-sandbox.dwolla.com";
  
  // Always use Basic Auth for consistency
  const basic = btoa(`${key}:${secret}`);
  const res = await fetch(`${base}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Dwolla token error: ${res.status}`, errorText);
    throw new Error(`Dwolla authentication failed: ${res.status}`);
  }
  
  const data = (await res.json()) as DwollaTokenResponse;
  if (!data.access_token) {
    throw new Error("Dwolla token response missing access_token");
  }
  
  return data.access_token;
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

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Load or create profile
    let { data: profile, error: pErr } = await supabase.from("profiles").select("id, user_id, first_name, last_name, dwolla_customer_id").eq("user_id", user.id).maybeSingle();
    
    if (pErr && pErr.code !== "PGRST116") { // PGRST116 = no rows returned
      console.error("Profile fetch error:", pErr);
      throw new Error("Failed to fetch user profile");
    }

    // Create profile if it doesn't exist
    if (!profile) {
      const { data: newProfile, error: createErr } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          first_name: user.user_metadata?.first_name || "Sandbox",
          last_name: user.user_metadata?.last_name || "User"
        })
        .select("id, user_id, first_name, last_name, dwolla_customer_id")
        .single();
      
      if (createErr) {
        console.error("Profile create error:", createErr);
        throw new Error("Failed to create user profile");
      }
      profile = newProfile;
    }

    if (profile?.dwolla_customer_id) {
      console.log(`Returning existing Dwolla customer: ${profile.dwolla_customer_id}`);
      return new Response(JSON.stringify({ dwollaCustomerId: profile.dwolla_customer_id, alreadyExists: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create Dwolla customer
    const token = await getDwollaToken(DWOLLA_ENV, DWOLLA_KEY, DWOLLA_SECRET);
    const base = DWOLLA_ENV === "production" ? "https://api.dwolla.com" : "https://api-sandbox.dwolla.com";

    const customerPayload = {
      firstName: profile?.first_name ?? user.user_metadata?.first_name ?? "Sandbox",
      lastName: profile?.last_name ?? user.user_metadata?.last_name ?? "User",
      email: user.email ?? `user-${user.id}@example.com`,
      type: "personal",
      businessName: undefined,
    } as Record<string, unknown>;

    const createRes = await fetch(`${base}/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.dwolla.v1.hal+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerPayload),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error(`Dwolla create customer failed: ${createRes.status}`, errorText);
      
      let userMessage = "Failed to create Dwolla customer";
      if (createRes.status === 400) {
        userMessage = "Invalid customer data provided";
      } else if (createRes.status === 401 || createRes.status === 403) {
        userMessage = "Dwolla authentication failed";
      }
      
      throw new Error(userMessage);
    }

    const location = createRes.headers.get("Location");
    if (!location) {
      console.error("Missing Location header from Dwolla response");
      throw new Error("Invalid response from Dwolla");
    }
    
    const dwollaCustomerId = location.split("/").pop();
    if (!dwollaCustomerId) {
      throw new Error("Invalid customer ID from Dwolla");
    }

    console.log(`Created new Dwolla customer: ${dwollaCustomerId}`);

    const { error: upErr } = await supabase
      .from("profiles")
      .update({ dwolla_customer_id: dwollaCustomerId })
      .eq("user_id", user.id);
      
    if (upErr) {
      console.error("Profile update error:", upErr);
      throw new Error("Failed to save Dwolla customer ID");
    }

    return new Response(JSON.stringify({ dwollaCustomerId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("dwolla-create-customer error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});