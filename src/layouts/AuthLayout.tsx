import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome to Electric AI</h1>
        <p className="auth-subtitle">Generate amazing property listings in seconds</p>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthLayout;