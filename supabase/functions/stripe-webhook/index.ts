import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received", { method: req.method });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      logStep("Missing signature or webhook secret");
      throw new Error("Missing webhook signature or secret");
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { sessionId: session.id });

        // Update payment status to completed
        const { error: updateError } = await supabase
          .from("payments")
          .update({ 
            status: "completed",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_session_id", session.id);

        if (updateError) {
          logStep("Error updating payment status", { error: updateError.message });
        } else {
          logStep("Payment status updated to completed", { sessionId: session.id });
        }

        // If there's an appointment associated, update its status
        if (session.metadata?.appointment_id) {
          const { error: appointmentError } = await supabase
            .from("appointments")
            .update({ 
              status: "confirmed",
              updated_at: new Date().toISOString()
            })
            .eq("id", session.metadata.appointment_id);

          if (appointmentError) {
            logStep("Error updating appointment status", { error: appointmentError.message });
          } else {
            logStep("Appointment status updated to confirmed", { 
              appointmentId: session.metadata.appointment_id 
            });
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.expired", { sessionId: session.id });

        // Update payment status to expired
        const { error: updateError } = await supabase
          .from("payments")
          .update({ 
            status: "expired",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_session_id", session.id);

        if (updateError) {
          logStep("Error updating payment status to expired", { error: updateError.message });
        } else {
          logStep("Payment status updated to expired", { sessionId: session.id });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Processing payment_intent.succeeded", { paymentIntentId: paymentIntent.id });

        // Find payment by checking for related checkout session
        if (paymentIntent.metadata?.session_id) {
          const { error: updateError } = await supabase
            .from("payments")
            .update({ 
              status: "completed",
              updated_at: new Date().toISOString()
            })
            .eq("stripe_session_id", paymentIntent.metadata.session_id);

          if (updateError) {
            logStep("Error updating payment status from payment_intent", { error: updateError.message });
          } else {
            logStep("Payment status updated via payment_intent", { 
              sessionId: paymentIntent.metadata.session_id 
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Processing payment_intent.payment_failed", { paymentIntentId: paymentIntent.id });

        // Update payment status to failed
        if (paymentIntent.metadata?.session_id) {
          const { error: updateError } = await supabase
            .from("payments")
            .update({ 
              status: "failed",
              updated_at: new Date().toISOString()
            })
            .eq("stripe_session_id", paymentIntent.metadata.session_id);

          if (updateError) {
            logStep("Error updating payment status to failed", { error: updateError.message });
          } else {
            logStep("Payment status updated to failed", { 
              sessionId: paymentIntent.metadata.session_id 
            });
          }
        }
        break;
      }

      default: {
        logStep("Unhandled event type", { eventType: event.type });
        // For unhandled events, just log and continue
        break;
      }
    }

    // Return a successful response to Stripe
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});