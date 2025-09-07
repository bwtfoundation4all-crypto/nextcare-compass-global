import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  type?: string; // 'general', 'support', 'partnership', etc.
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject = "Contact Form Submission", message, type = "general" }: ContactEmailRequest = await req.json();

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "NextCare Global <noreply@resend.dev>",
      to: [email],
      subject: "We received your message - NextCare Global",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">NextCare Global</h1>
            <p style="color: #666; margin: 0;">Healthcare Access Consulting</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Thank You for Contacting Us!</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Dear ${name},
          </p>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            We have received your message and appreciate you reaching out to us. Our team will review your inquiry and respond as soon as possible, typically within 24 hours.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Your Message:</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 10px 0 0 0; color: #374151; font-style: italic;">"${message}"</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">Need Immediate Assistance?</h3>
            <p style="color: #1e40af; margin: 0;">
              If your inquiry is urgent, please don't hesitate to contact us directly at 
              <a href="mailto:support@nextcareglobal.com" style="color: #1e40af; text-decoration: underline;">support@nextcareglobal.com</a>
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            We're committed to helping you access quality healthcare worldwide. Thank you for choosing NextCare Global.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nextcareglobal.com/services" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Explore Our Services</a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Best regards,<br>
              The NextCare Global Team<br>
              <a href="mailto:support@nextcareglobal.com" style="color: #2563eb;">support@nextcareglobal.com</a>
            </p>
          </div>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "NextCare Notifications <notifications@resend.dev>",
      to: ["admin@nextcareglobal.com"], // Replace with actual admin email
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">📧 New Contact Form Submission</h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e40af; margin-top: 0;">Contact Information</h3>
            <p style="margin: 8px 0; color: #1e40af;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #1e40af;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1e40af;">${email}</a></p>
            <p style="margin: 8px 0; color: #1e40af;"><strong>Type:</strong> ${type}</p>
            <p style="margin: 8px 0; color: #1e40af;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Subject:</h3>
            <p style="color: #374151; margin: 0; font-weight: 600;">${subject}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Message:</h3>
            <p style="color: #374151; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: ${subject}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to Customer</a>
          </div>
        </div>
      `,
    });

    console.log("Contact emails sent successfully:", { userEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      userEmailId: userEmailResponse.data?.id,
      adminEmailId: adminEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending contact emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);