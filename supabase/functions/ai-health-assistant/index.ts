import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Create or get chat session
    let session;
    if (sessionId) {
      const { data } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = data;
    } else {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: userId,
          session_name: `Health Chat ${new Date().toLocaleDateString()}`,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      session = data;
    }

    // Save user message
    await supabase
      .from('ai_chat_messages')
      .insert({
        session_id: session.id,
        role: 'user',
        content: message
      });

    // Get recent chat history for context
    const { data: recentMessages } = await supabase
      .from('ai_chat_messages')
      .select('role, content')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(20);

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are a knowledgeable health assistant for NextCare Global Services. You provide helpful, accurate health information while being empathetic and supportive. 

IMPORTANT GUIDELINES:
- Always recommend consulting with healthcare professionals for medical concerns
- Provide general health information and wellness tips
- Be supportive and understanding
- Never diagnose medical conditions
- Encourage preventive care and healthy lifestyle choices
- If asked about emergencies, advise calling emergency services immediately

Your responses should be helpful, compassionate, and medically responsible.`
      },
      ...(recentMessages || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Save assistant message
    await supabase
      .from('ai_chat_messages')
      .insert({
        session_id: session.id,
        role: 'assistant',
        content: assistantMessage
      });

    return new Response(JSON.stringify({
      message: assistantMessage,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI health assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});