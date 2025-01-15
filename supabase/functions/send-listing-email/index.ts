import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        profiles (
          email,
          email_notifications
        ),
        listing_images (
          image_url
        )
      `)
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new Error('Failed to fetch listing details');
    }

    // Check if email notifications are enabled
    if (!listing.profiles.email_notifications) {
      return new Response(
        JSON.stringify({ message: 'Email notifications disabled for this user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imagesList = listing.listing_images.map((img: any) => 
      `<li><a href="${img.image_url}">View Image</a></li>`
    ).join('');

    const emailHtml = `
      <h1>${listing.title}</h1>
      <h2>Listing Details:</h2>
      <ul>
        <li><strong>Type:</strong> ${listing.listing_type} - ${listing.property_type}</li>
        <li><strong>Location:</strong> ${listing.location}</li>
        <li><strong>Bedrooms:</strong> ${listing.bedrooms}</li>
        <li><strong>Bathrooms:</strong> ${listing.bathrooms}</li>
      </ul>

      <div style="margin-top: 20px;">
        <strong>Standout Features:</strong>
        <ul>
          ${listing.standout_features?.map((feature: string) => `<li>${feature}</li>`).join('') || 'None specified'}
        </ul>
      </div>

      ${listing.additional_details ? `
        <div style="margin-top: 20px;">
          <strong>Additional Details:</strong>
          <p>${listing.additional_details}</p>
        </div>
      ` : ''}

      ${listing.generation_instructions ? `
        <div style="margin-top: 20px;">
          <strong>Generation Instructions:</strong>
          <p>${listing.generation_instructions}</p>
        </div>
      ` : ''}

      <h2>Listing:</h2>
      <h4>Full Description:</h4>
      <p>${listing.full_description}</p>

      <h4>Short Summary:</h4>
      <p>${listing.short_summary}</p>

      <h4>Key Features:</h4>
      <ul>
        ${listing.key_features?.map((feature: string) => `<li>${feature}</li>`).join('')}
      </ul>

      ${listing.listing_images.length > 0 ? `
        <h4>Uploaded Images:</h4>
        <ul>${imagesList}</ul>
      ` : ''}

      <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="font-style: italic;">Due to the nature of AI, extra details or inaccuracies may sometimes appear in generated descriptions. Please ensure that all of the information in the generated description is accurate to your listing and edit as necessary before using in your particulars. Electric AI takes no responsibility in any inaccurate information generated in listing descriptions.</p>
      </div>

      <div style="margin-top: 30px;">
        <p>With Love,<br>Hector @ Electric AI</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Electric AI Listing Generator <notifications@email.subyak.com>',
        to: [listing.profiles.email],
        subject: `${listing.title} - Your Listing is Ready`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-listing-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});