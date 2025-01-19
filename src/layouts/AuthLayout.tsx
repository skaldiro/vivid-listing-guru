import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      if (event === 'SIGNED_IN' && session) {
        navigate("/home");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img 
        src="/lovable-uploads/0644edac-ccbc-4c0e-b3b6-23179bdb60bb.png"
        alt="Electric AI"
        className="h-16 mb-8"
      />
      <div className="max-w-md w-full space-y-8">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthLayout;