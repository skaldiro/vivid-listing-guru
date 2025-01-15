import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Listing {
  id: string;
  title: string;
  created_at: string;
  listing_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  price: number;
  standout_features: string;
  additional_details: string;
  generation_instructions: string;
  full_description: string;
  short_summary: string;
  key_features: string[];
}

const Listings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Listing[];
    }
  });

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const copyToClipboard = async (listing: Listing) => {
    const content = `
${listing.title}
${listing.property_type} for ${listing.listing_type}
Location: ${listing.location}
Price: £${listing.price?.toLocaleString()}

${listing.full_description}

Key Features:
${listing.key_features?.join('\n')}

${listing.additional_details}
    `.trim();

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

  const handleRegenerate = (listing: Listing) => {
    navigate('/generate', { 
      state: { 
        prefill: {
          title: listing.title,
          listingType: listing.listing_type,
          propertyType: listing.property_type,
          bedrooms: listing.bedrooms?.toString(),
          bathrooms: listing.bathrooms?.toString(),
          location: listing.location,
          price: listing.price?.toString(),
          standoutFeatures: listing.standout_features,
          additionalDetails: listing.additional_details,
          generationInstructions: listing.generation_instructions,
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Left sidebar with listings */}
        <div className="col-span-4 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Your Listings</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-2 p-4">
              {listings?.map((listing) => (
                <div
                  key={listing.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedListing?.id === listing.id
                      ? 'bg-primary/10'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedListing(listing)}
                >
                  <h3 className="font-medium">{listing.title}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(listing.created_at), 'PPP')}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main content area */}
        <div className="col-span-8">
          {selectedListing ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{selectedListing.title}</h1>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(selectedListing)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Listing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRegenerate(selectedListing)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-Generate
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Listing Type</p>
                      <p className="text-gray-600">{selectedListing.listing_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Property Type</p>
                      <p className="text-gray-600">{selectedListing.property_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-gray-600">{selectedListing.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-gray-600">£{selectedListing.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bedrooms</p>
                      <p className="text-gray-600">{selectedListing.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bathrooms</p>
                      <p className="text-gray-600">{selectedListing.bathrooms}</p>
                    </div>
                    {selectedListing.standout_features && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Standout Features</p>
                        <p className="text-gray-600">{selectedListing.standout_features}</p>
                      </div>
                    )}
                    {selectedListing.additional_details && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Additional Details</p>
                        <p className="text-gray-600">{selectedListing.additional_details}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Full Description</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {selectedListing.full_description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Short Summary</h3>
                      <p className="text-gray-600">
                        {selectedListing.short_summary}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Key Features</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {selectedListing.key_features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a listing to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;