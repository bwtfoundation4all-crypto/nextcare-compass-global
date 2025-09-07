import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationEmailRequest {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  service: string;
  message?: string;
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, country, service, message, requestId }: ConsultationEmailRequest = await req.json();

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "NextCare Global <noreply@resend.dev>",
      to: [email],
      subject: "Consultation Request Received - NextCare Global",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">NextCare Global</h1>
            <p style="color: #666; margin: 0;">Healthcare Access Consulting</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Thank You for Your Consultation Request!</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Dear ${name},
          </p>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            We have successfully received your consultation request. Our expert team will review your information and contact you within 24 hours to discuss your healthcare needs.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Request Details:</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Request ID:</strong> ${requestId}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Service:</strong> ${service}</p>
            ${phone ? `<p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> ${phone}</p>` : ''}
            ${country ? `<p style="margin: 5px 0; color: #374151;"><strong>Country:</strong> ${country}</p>` : ''}
            ${message ? `<p style="margin: 5px 0; color: #374151;"><strong>Message:</strong> ${message}</p>` : ''}
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">What Happens Next?</h3>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our specialists will review your case within 24 hours</li>
              <li style="margin-bottom: 8px;">We'll contact you to schedule a free consultation call</li>
              <li style="margin-bottom: 8px;">Together, we'll create a personalized healthcare access plan</li>
              <li>You'll receive ongoing support throughout your healthcare journey</li>
            </ul>
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            In the meantime, feel free to explore our services and learn more about how we can help you access quality healthcare worldwide.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:support@nextcareglobal.com" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Contact Support</a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              NextCare Global Services<br>
              Healthcare Access Consulting<br>
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
      subject: `New Consultation Request - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">🚨 New Consultation Request</h2>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">Urgent: Customer Contact Required</h3>
            <p style="color: #991b1b; margin: 0;">A new consultation request has been submitted and requires immediate attention.</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Customer Information:</h3>
            <p style="margin: 8px 0; color: #374151;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            ${phone ? `<p style="margin: 8px 0; color: #374151;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #2563eb;">${phone}</a></p>` : ''}
            ${country ? `<p style="margin: 8px 0; color: #374151;"><strong>Country:</strong> ${country}</p>` : ''}
            <p style="margin: 8px 0; color: #374151;"><strong>Service:</strong> ${service}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Request ID:</strong> ${requestId}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${message ? `
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 15px;">Customer Message:</h3>
              <p style="color: #0c4a6e; font-style: italic; margin: 0;">"${message}"</p>
            </div>
          ` : ''}
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0; margin-bottom: 15px;">Action Required:</h3>
            <ul style="color: #166534; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Contact customer within 24 hours</li>
              <li style="margin-bottom: 8px;">Review their specific healthcare needs</li>
              <li style="margin-bottom: 8px;">Schedule consultation call</li>
              <li>Update CRM with consultation status</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: Your Consultation Request (${requestId})" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">Reply to Customer</a>
            ${phone ? `<a href="tel:${phone}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Call Customer</a>` : ''}
          </div>
        </div>
      `,
    });

    console.log("Consultation emails sent successfully:", { userEmailResponse, adminEmailResponse });

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
    console.error("Error sending consultation emails:", error);
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