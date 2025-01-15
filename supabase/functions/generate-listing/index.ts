import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received request to generate-listing function');
    const requestData = await req.json();
    console.log('Request data:', requestData);

    const { listingId, listingType, propertyType, bedrooms, bathrooms, location, standoutFeatures, additionalDetails } = requestData;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the images for the listing
    const { data: listingImages, error: listingImagesError } = await supabase
      .from('listing_images')
      .select('image_url')
      .eq('listing_id', listingId);

    if (listingImagesError) {
      console.error('Error fetching listing images:', listingImagesError);
      throw listingImagesError;
    }

    let imageAnalysis = '';
    if (listingImages && listingImages.length > 0) {
      console.log('Analyzing images:', listingImages);
      
      // Analyze images with GPT-4 Vision
      const imageAnalysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze these property images and describe the key visual features and amenities you can see. Focus on architectural details, condition, design elements, and any standout features that would be valuable in a property listing.',
                },
                ...listingImages.map(img => ({
                  type: 'image_url',
                  image_url: img.image_url,
                })),
              ],
            },
          ],
        }),
      });

      if (!imageAnalysisResponse.ok) {
        const errorData = await imageAnalysisResponse.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const analysisData = await imageAnalysisResponse.json();
      imageAnalysis = analysisData.choices[0].message.content;
      console.log('Image analysis:', imageAnalysis);
    }

    const prompt = `Create a compelling property listing for the following property:
      Type: ${listingType} - ${propertyType}
      Details: ${bedrooms} bedrooms, ${bathrooms} bathrooms
      Location: ${location}
      Key Features: ${standoutFeatures}
      Additional Information: ${additionalDetails}
      
      Image Analysis: ${imageAnalysis}

      Based on both the provided information and the image analysis, please provide:
      1. A professional and engaging full description that incorporates all the visual details from the images and the provided information
      2. A concise summary for preview cards
      3. A list of 5 key selling points, incorporating both the provided features and visual elements from the images

      Return your response in the following JSON format:
      {
        "full_description": "your full description here",
        "short_summary": "your short summary here",
        "key_features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
      }`;

    console.log('Sending request to OpenAI');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional real estate copywriter. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let generatedContent;
    try {
      generatedContent = JSON.parse(data.choices[0].message.content);
      console.log('Parsed generated content:', generatedContent);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse OpenAI response');
    }

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