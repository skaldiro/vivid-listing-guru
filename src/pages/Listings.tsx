import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingSidebar } from "@/components/listings/ListingSidebar";
import { ListingInputs } from "@/components/listings/ListingInputs";
import { ListingContent } from "@/components/listings/ListingContent";
import { Listing } from "@/types/listing";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Listings = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const location = useLocation();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Listing[];
    }
  });

  useEffect(() => {
    if (listings && listings.length > 0) {
      // If we just created a new listing, select it and scroll to top
      if (location.state?.newListing) {
        const newListing = listings[0];
        setSelectedListing(newListing);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!selectedListing) {
        setSelectedListing(listings[0]);
      }
    }
  }, [listings, location.state, selectedListing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="h-full">
              <ListingSidebar 
                listings={listings || []}
                selectedListing={selectedListing}
                onSelectListing={setSelectedListing}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-4 h-[calc(100vh-8rem)]">
          <ListingSidebar 
            listings={listings || []}
            selectedListing={selectedListing}
            onSelectListing={setSelectedListing}
          />
        </div>
        
        <div className="lg:col-span-8">
          {selectedListing ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{selectedListing.title}</h1>
              </div>

              <div className="grid gap-6">
                <ListingInputs listing={selectedListing} />
                <ListingContent listing={selectedListing} />
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