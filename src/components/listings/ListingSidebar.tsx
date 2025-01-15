import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Listing } from "@/types/listing";

interface ListingSidebarProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing) => void;
}

export const ListingSidebar = ({ listings, selectedListing, onSelectListing }: ListingSidebarProps) => {
  return (
    <div className="col-span-4 bg-white rounded-lg shadow h-[calc(100vh-8rem)]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Your Listings</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-2 p-4">
          {listings?.map((listing) => (
            <div
              key={listing.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedListing?.id === listing.id
                  ? 'bg-primary/10'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectListing(listing)}
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
  );
};