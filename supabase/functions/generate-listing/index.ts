import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received request to generate-listing function');
    const requestData = await req.json();
    console.log('Request data:', requestData);

    const { listingId, title, listingType, propertyType, bedrooms, bathrooms, location, price, standoutFeatures, additionalDetails } = requestData;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const prompt = `Create a compelling property listing for the following property:
      Title: ${title}
      Type: ${listingType} - ${propertyType}
      Details: ${bedrooms} bedrooms, ${bathrooms} bathrooms
      Location: ${location}
      Price: £${price}
      Key Features: ${standoutFeatures}
      Additional Information: ${additionalDetails}

      Please provide:
      1. A professional and engaging full description (full_description)
      2. A concise summary for preview cards (short_summary)
      3. A list of 5 key selling points (key_features)

      Format the response as JSON with these exact keys: full_description, short_summary, key_features`

    console.log('Sending request to OpenAI');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional real estate copywriter skilled in creating compelling property listings.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    const generatedContent = JSON.parse(data.choices[0].message.content);

    console.log('Updating listing in database');
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        full_description: generatedContent.full_description,
        short_summary: generatedContent.short_summary,
        key_features: generatedContent.key_features,
      })
      .eq('id', listingId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    console.log('Successfully generated and updated listing');
    return new Response(
      JSON.stringify({ message: 'Listing generated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-listing function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});