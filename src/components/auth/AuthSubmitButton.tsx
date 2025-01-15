import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthSubmitButtonProps {
  isSignUp: boolean;
  isSubmitting: boolean;
}

export const AuthSubmitButton = ({ isSignUp, isSubmitting }: AuthSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isSignUp ? "Creating account..." : "Signing in..."}
        </>
      ) : (
        isSignUp ? "Create account" : "Sign in"
      )}
    </Button>
  );
};