import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

const AuthForm = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        // Clear any existing errors on successful sign in
        setError(null);
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    // Set up error handling for auth state changes
    const handleAuthError = async () => {
      const { error: authError } = await supabase.auth.getSession();
      if (authError) {
        setError(getErrorMessage(authError));
      }
    };

    handleAuthError();
    return () => subscription.unsubscribe();
  }, []);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please verify your email address before signing in.';
      default:
        return error.message;
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to Electric AI</h1>
      <p className="text-gray-600 text-center mb-8">
        Generate amazing property listings in seconds
      </p>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        providers={[]}
        view="sign_in"
        showLinks={true}
        redirectTo={`${window.location.origin}/`}
        onlyThirdPartyProviders={false}
      />
    </div>
  );
};

export default AuthForm;