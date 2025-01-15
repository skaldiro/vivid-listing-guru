import NavBar from "@/components/NavBar";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MainLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });

      return () => subscription.unsubscribe();
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