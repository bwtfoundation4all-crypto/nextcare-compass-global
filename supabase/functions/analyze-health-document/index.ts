import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, documentType } = await req.json();

    if (!text) {
      throw new Error('Document text is required');
    }

    let systemPrompt = '';
    let analysisTask = '';

    switch (documentType) {
      case 'lab_result':
        systemPrompt = 'You are a medical document analysis assistant specializing in laboratory results. Analyze the provided lab results and extract key information.';
        analysisTask = `Analyze this lab result and provide:
1. Test names and values
2. Reference ranges
3. Abnormal values (if any)
4. General interpretation (note: not medical advice)
5. Suggested follow-up actions

Format the response in a clear, structured way.`;
        break;
      
      case 'prescription':
        systemPrompt = 'You are a medical document analysis assistant specializing in prescriptions. Extract and organize prescription information.';
        analysisTask = `Analyze this prescription and extract:
1. Medication names and dosages
2. Instructions for use
3. Duration of treatment
4. Prescribing doctor information
5. Pharmacy instructions

Format the response clearly and highlight important safety information.`;
        break;
      
      case 'medical_report':
        systemPrompt = 'You are a medical document analysis assistant specializing in medical reports. Extract key medical information.';
        analysisTask = `Analyze this medical report and extract:
1. Patient information (if present)
2. Diagnosis or findings
3. Treatment recommendations
4. Important dates
5. Follow-up requirements

Organize the information in a structured format.`;
        break;
      
      default:
        systemPrompt = 'You are a medical document analysis assistant. Analyze the provided medical document and extract relevant information.';
        analysisTask = `Analyze this medical document and extract:
1. Document type and purpose
2. Key medical information
3. Important dates
4. Recommendations or instructions
5. Any concerning findings

Provide a clear, organized summary.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}

IMPORTANT: Always include this disclaimer at the end of your analysis:
"⚠️ IMPORTANT: This analysis is for informational purposes only and should not be considered medical advice. Always consult with qualified healthcare professionals for medical interpretation and decisions."`
          },
          {
            role: 'user',
            content: `${analysisTask}

Document text:
${text}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({
      analysis,
      documentType,
      processedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error analyzing document:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze document' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});