import NavBar from "@/components/NavBar";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MainLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state change:", event);
          if (event === 'SIGNED_OUT' || !session) {
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="main-layout">
      <NavBar />
      <main className="main-container max-w-7xl mx-auto px-4 py-8">
        <Outlet />
        <div className="mt-8 space-y-2">
          <p className="text-sm text-gray-500 italic">
            Due to the nature of AI, extra details or inaccuracies may sometimes appear in generated descriptions. 
            Please ensure that all of the information in the generated description is accurate to your listing and 
            edit as necessary before using in your particulars. Electric AI takes no responsibility in any inaccurate 
            information generated in listing descriptions.
          </p>
          <p className="text-sm text-gray-500">
            By using Electric AI you agree to our Terms & Conditions
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Electric AI
          </p>
        </div>
      </main>
    </div>
  );
};