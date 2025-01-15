import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { PlusCircle, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavItemsProps {
  onItemClick?: () => void;
}

const NavItems = ({ onItemClick }: NavItemsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <NavigationMenuItem className="w-full">
        <NavigationMenuLink
          className={`${navigationMenuTriggerStyle()} w-full justify-start`}
          onClick={() => {
            navigate("/generate");
            onItemClick?.();
          }}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Generate</span>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem className="w-full">
        <NavigationMenuLink
          className={`${navigationMenuTriggerStyle()} w-full justify-start`}
          onClick={() => {
            navigate("/listings");
            onItemClick?.();
          }}
        >
          <List className="h-4 w-4 mr-2" />
          <span>Listings</span>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );
};

export default NavItems;