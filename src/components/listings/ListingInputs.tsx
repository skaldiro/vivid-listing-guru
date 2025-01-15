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
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Bedrooms</p>
              <p className="text-gray-600">{listing.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Bathrooms</p>
              <p className="text-gray-600">{listing.bathrooms}</p>
            </div>
            {listing.standout_features && listing.standout_features.length > 0 && (
              <div>
                <p className="text-sm font-medium">Standout Features</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.standout_features.map((feature, index) => (
                    <span key={index} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {listing.additional_details && (
          <div className="mt-6">
            <p className="text-sm font-medium">Additional Details</p>
            <p className="text-gray-600">{listing.additional_details}</p>
          </div>
        )}
        {listing.generation_instructions && (
          <div className="mt-4">
            <p className="text-sm font-medium">Generation Instructions</p>
            <p className="text-gray-600">{listing.generation_instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};