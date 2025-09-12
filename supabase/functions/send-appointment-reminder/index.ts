import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get appointments in the next 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        profiles!appointments_user_id_fkey(first_name, last_name)
      `)
      .gte('appointment_date', new Date().toISOString())
      .lt('appointment_date', tomorrow.toISOString())
      .eq('status', 'scheduled');

    if (error) {
      throw error;
    }

    console.log(`Found ${appointments?.length || 0} appointments to remind`);

    const emailPromises = appointments?.map(async (appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      const formattedDate = appointmentDate.toLocaleDateString();
      const formattedTime = appointmentDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      return resend.emails.send({
        from: "NextCare Global Services <appointments@resend.dev>",
        to: [appointment.contact_email],
        subject: "Appointment Reminder - Tomorrow",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Appointment Reminder</h2>
            
            <p>Dear ${appointment.profiles?.first_name || 'Valued Patient'},</p>
            
            <p>This is a friendly reminder about your upcoming appointment:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Appointment Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Type:</strong> ${appointment.appointment_type}</p>
              ${appointment.consultant_name ? `<p><strong>Consultant:</strong> ${appointment.consultant_name}</p>` : ''}
              ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
            </div>
            
            <h4>Preparation Tips:</h4>
            <ul>
              <li>Arrive 15 minutes early for check-in</li>
              <li>Bring a valid ID and insurance card</li>
              <li>Prepare a list of current medications</li>
              <li>Write down any questions you'd like to ask</li>
            </ul>
            
            <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>
            <strong>NextCare Global Services Team</strong></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              This is an automated reminder. Please do not reply to this email.
            </p>
          </div>
        `,
      });
    }) || [];

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Reminder emails sent: ${successful} successful, ${failed} failed`);

    return new Response(JSON.stringify({ 
      success: true,
      sent: successful,
      failed: failed,
      total: appointments?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending appointment reminders:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});