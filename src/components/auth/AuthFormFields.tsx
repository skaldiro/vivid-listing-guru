import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormFieldsProps {
  isSignUp: boolean;
  fullName: string;
  setFullName: (value: string) => void;
  agencyName: string;
  setAgencyName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isSubmitting: boolean;
}

export const AuthFormFields = ({
  isSignUp,
  fullName,
  setFullName,
  agencyName,
  setAgencyName,
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
}: AuthFormFieldsProps) => {
  return (
    <>
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
              placeholder="John Doe"
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
              placeholder="Real Estate Agency"
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
          placeholder="you@example.com"
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
          placeholder="••••••••"
        />
      </div>
    </>
  );
};