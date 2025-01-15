import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Listing } from "@/types/listing";

interface ListingContentProps {
  listing: Listing;
}

export const ListingContent = ({ listing }: ListingContentProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const copyToClipboard = async () => {
    const content = `${listing.full_description}

Key Features:
${listing.key_features?.join('\n')}

${listing.short_summary}`.trim();

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "The listing content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive"
      });
    }
  };

  const handleRegenerate = () => {
    navigate('/generate', { 
      state: { 
        prefill: {
          title: listing.title,
          listingType: listing.listing_type,
          propertyType: listing.property_type,
          bedrooms: listing.bedrooms?.toString(),
          bathrooms: listing.bathrooms?.toString(),
          location: listing.location,
          standoutFeatures: listing.standout_features,
          additionalDetails: listing.additional_details,
          generationInstructions: listing.generation_instructions,
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Listing</CardTitle>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Listing
          </Button>
          <Button
            variant="outline"
            onClick={handleRegenerate}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-Generate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Full Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {listing.full_description}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Short Summary</h3>
          <p className="text-gray-600">
            {listing.short_summary}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Key Features</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {listing.key_features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};