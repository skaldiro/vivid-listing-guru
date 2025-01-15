import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing session on auth page load
    const cleanupSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // If there's an existing session on the auth page, clear it
          await supabase.auth.signOut();
          console.log("Cleared existing session on auth page");
        }
      } catch (error) {
        console.error("Error cleaning up session:", error);
        // Attempt to clear session even if there's an error
        await supabase.auth.signOut();
      }
    };

    cleanupSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthLayout;