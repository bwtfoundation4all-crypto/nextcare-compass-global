import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { name, email, phone, country, service, message } = await req.json();

    // Insert consultation request
    const { data, error } = await supabaseClient
      .from("consultation_requests")
      .insert({
        name,
        email,
        phone,
        country,
        service_type: service,
        message,
        status: "pending",
        priority: "normal"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send email confirmation
    console.log("New consultation request:", data);
    
    try {
      // Call email service (using try-catch to prevent failure if email service fails)
      await supabaseClient.functions.invoke('send-consultation-email', {
        body: {
          name,
          email,
          phone,
          country,
          service,
          message,
          requestId: data.id
        }
      });
      console.log("Consultation emails sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Consultation request submitted successfully",
        requestId: data.id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});