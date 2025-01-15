import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, Menu, PlusCircle, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
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

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div 
          className="font-semibold text-xl cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Electric AI
        </div>

        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            <NavItems />
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          <div className="md:hidden">
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
          </div>

          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;