import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AuthForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        setError(null);
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownEndTime) {
      timer = setInterval(() => {
        if (new Date() >= cooldownEndTime) {
          setCooldownEndTime(null);
          setIsSubmitting(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownEndTime]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
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
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = getErrorMessage(err as AuthError);
        setError(errorMessage);
        
        // Handle rate limiting
        if ((err as AuthError).message.includes('rate_limit')) {
          const waitSeconds = parseInt(err.message.match(/\d+/)?.[0] || '60');
          const endTime = new Date(Date.now() + waitSeconds * 1000);
          setCooldownEndTime(endTime);
          return;
        }
      }
    } finally {
      if (!cooldownEndTime) {
        setIsSubmitting(false);
      }
    }
  };

  const getErrorMessage = (error: AuthError) => {
    if (error.message.includes('rate_limit')) {
      const waitSeconds = parseInt(error.message.match(/\d+/)?.[0] || '60');
      return `Please wait ${waitSeconds} seconds before trying again.`;
    }

    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please verify your email address before signing in.';
      case 'Invalid email or password':
        return 'Invalid email or password. Please check your credentials and try again.';
      default:
        return error.message;
    }
  };

  const getRemainingCooldownTime = () => {
    if (!cooldownEndTime) return '';
    const now = new Date();
    const diff = Math.ceil((cooldownEndTime.getTime() - now.getTime()) / 1000);
    return diff > 0 ? `(${diff}s)` : '';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Welcome to Electric AI</h1>
      <p className="text-gray-600 text-center mb-8">
        Generate amazing property listings in seconds
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {error} {getRemainingCooldownTime()}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
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