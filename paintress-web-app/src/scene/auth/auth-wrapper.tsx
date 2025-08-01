import { ClerkProvider } from "@clerk/clerk-react";
import { memo } from "react";
import { TraditionalAuthScene } from "./traditional/auth";
import ClerkAuth from "./auth-clerk";
import { $api } from "@/lib/fetch";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const ClerkAuthWrapper = memo(() => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ClerkAuth />
    </ClerkProvider>
  );
});

export const AuthWrapper = () => {
  const { data } = $api.useQuery("get", "/api/v1/config/");

  if (data?.auth_type === "clerk") {
    return <ClerkAuthWrapper />;
  }

  return <TraditionalAuthScene />;
};
