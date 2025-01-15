import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Listing } from "@/types/listing";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ListingSidebarProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ListingSidebar = ({ 
  listings, 
  selectedListing, 
  onSelectListing,
  isOpen,
  onOpenChange 
}: ListingSidebarProps) => {
  const handleListingClick = (listing: Listing) => {
    onSelectListing(listing);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const SidebarContent = () => (
    <div className="h-full bg-white rounded-lg shadow">
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
              onClick={() => handleListingClick(listing)}
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

  if (isOpen !== undefined && onOpenChange) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarContent />;
};