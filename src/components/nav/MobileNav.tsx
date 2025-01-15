import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Settings, LogOut } from "lucide-react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import NavItems from "./NavItems";
import { useNavigate } from "react-router-dom";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

const MobileNav = ({ isOpen, setIsOpen, handleLogout }: MobileNavProps) => {
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <nav className="flex flex-col space-y-4 mt-4">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col w-full space-y-2">
              <NavItems onItemClick={() => setIsOpen(false)} />
            </NavigationMenuList>
          </NavigationMenu>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => {
              navigate("/settings");
              setIsOpen(false);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;