import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AuthForm = () => {
  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to Electric AI</h1>
      <p className="text-gray-600 text-center mb-8">
        Generate amazing property listings in seconds
      </p>
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