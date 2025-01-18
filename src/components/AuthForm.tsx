import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthFormFields } from "./auth/AuthFormFields";
import { AuthSubmitButton } from "./auth/AuthSubmitButton";
import { useToast } from "@/hooks/use-toast";

const AuthForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    if (isSignUp && (!fullName || !agencyName)) {
      setError("Full name and agency name are required for sign up");
      return false;
    }
    return true;
  };

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("invalid_credentials")) {
            return "Invalid email or password. Please check your credentials and try again.";
          }
          return "Invalid request. Please check your input and try again.";
        case 422:
          return "Invalid email format. Please enter a valid email address.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    
    setIsSubmitting(true);
    console.log("Starting auth process...", { email, isSignUp });

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              agency_name: agencyName
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          toast({
            title: "Account created successfully",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err instanceof AuthError) {
        setError(getErrorMessage(err));
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Welcome to Electric AI</h1>
      <p className="text-gray-600 text-center mb-8">
        Generate amazing property listings in seconds
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormFields
          isSignUp={isSignUp}
          fullName={fullName}
          setFullName={setFullName}
          agencyName={agencyName}
          setAgencyName={setAgencyName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSubmitting={isSubmitting}
        />

        <AuthSubmitButton 
          isSignUp={isSignUp} 
          isSubmitting={isSubmitting} 
        />
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-sm text-blue-600 hover:underline"
          disabled={isSubmitting}
        >
          {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;