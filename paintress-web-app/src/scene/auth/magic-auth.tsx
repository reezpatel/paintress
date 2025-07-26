import { Mail } from "lucide-react";
import { Button } from "../../components/ui/button";

interface MagicAuthProps {
  email: string;
  onResetAuth: () => void;
}

export const MagicAuth = ({ email, onResetAuth }: MagicAuthProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="mb-6">
        <Mail className="h-6 w-6 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-sm text-muted-foreground mt-2">
          We've sent a magic link to {email}
        </p>
      </div>
      <Button
        onClick={onResetAuth}
        variant="link"
        className="text-sm p-0 h-auto"
      >
        Use a different email
      </Button>
    </div>
  );
};
