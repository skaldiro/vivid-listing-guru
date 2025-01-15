import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import NavItems from "./nav/NavItems";
import MobileNav from "./nav/MobileNav";
import UserMenu from "./nav/UserMenu";

const NavBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just redirect to auth
        navigate("/auth");
        return;
      }

      // Proceed with logout
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        
        // If we get a user_not_found error, force clear the session
        if (error.message.includes("user_not_found")) {
          await supabase.auth.signOut({ scope: 'local' });
          navigate("/auth");
        }
      } else {
        // Clear any local storage items if needed
        localStorage.removeItem('supabase.auth.token');
        navigate("/auth");
      }
    } catch (error: any) {
      console.error("Unexpected error during logout:", error);
      // Force a local signout in case of any errors
      await supabase.auth.signOut({ scope: 'local' });
      navigate("/auth");
    }
  };

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
            <MobileNav 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              handleLogout={handleLogout} 
            />
          </div>

          <div className="hidden md:block">
            <UserMenu handleLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;