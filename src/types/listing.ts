export interface Listing {
  id: string;
  title: string;
  created_at: string;
  listing_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  standout_features: string;
  additional_details: string;
  generation_instructions: string;
  full_description: string;
  short_summary: string;
  key_features: string[];
}