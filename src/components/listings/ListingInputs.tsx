import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listing } from "@/types/listing";

interface ListingInputsProps {
  listing: Listing;
}

export const ListingInputs = ({ listing }: ListingInputsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inputs</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <p className="text-sm font-medium">Listing Type</p>
          <p className="text-gray-600">{listing.listing_type}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Property Type</p>
          <p className="text-gray-600">{listing.property_type}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Location</p>
          <p className="text-gray-600">{listing.location}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Bedrooms</p>
          <p className="text-gray-600">{listing.bedrooms}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Bathrooms</p>
          <p className="text-gray-600">{listing.bathrooms}</p>
        </div>
        {listing.standout_features && (
          <div>
            <p className="text-sm font-medium">Standout Features</p>
            <p className="text-gray-600">{listing.standout_features}</p>
          </div>
        )}
        {listing.additional_details && (
          <div>
            <p className="text-sm font-medium">Additional Details</p>
            <p className="text-gray-600">{listing.additional_details}</p>
          </div>
        )}
        {listing.generation_instructions && (
          <div>
            <p className="text-sm font-medium">Generation Instructions</p>
            <p className="text-gray-600">{listing.generation_instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};