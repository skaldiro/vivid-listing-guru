import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;