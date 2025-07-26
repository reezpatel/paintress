import { useState } from "react";
import { EmailAuth } from "./email-auth";
import { PasswordAuth } from "./password-auth";
import { MagicAuth } from "./magic-auth";
import { ForgotPasswordDialog } from "./forgot-password-dialog";
import { RegisterDialog } from "./register-dialog";

export const AuthScene = () => {
  const [email, setEmail] = useState("");
  const [authMode, setAuthMode] = useState<"email" | "password" | "magic">(
    "email"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    if (!email) return;
    setEmail(email);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setAuthMode("password");
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handlePasswordSignIn = async (password: string) => {
    if (!password) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleMagicLink = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setAuthMode("magic");
  };

  const handleForgotPassword = async (forgotEmail: string) => {
    if (!forgotEmail) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowForgotPassword(false);
  };

  const handleRegister = async (registerData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    )
      return;
    if (registerData.password !== registerData.confirmPassword) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowRegister(false);
  };

  const resetAuth = () => {
    setEmail("");
    setAuthMode("email");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="logo" className="w-16 h-16 rounded-sm" />
          </div>

          <div className="text-center mb-16">
            <h1 className="text-lg font-medium text-card-foreground mb-2 tracking-wide">
              Welcome back to Paintress
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          {authMode === "email" && (
            <EmailAuth
              isLoading={isLoading}
              onEmailSubmit={handleEmailSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              onRegisterClick={() => setShowRegister(true)}
            />
          )}

          {authMode === "password" && (
            <PasswordAuth
              email={email}
              isLoading={isLoading}
              onPasswordSignIn={handlePasswordSignIn}
              onMagicLink={handleMagicLink}
              onForgotPassword={() => setShowForgotPassword(true)}
              onResetAuth={resetAuth}
            />
          )}

          {authMode === "magic" && (
            <MagicAuth email={email} onResetAuth={resetAuth} />
          )}
        </div>
      </div>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        isLoading={isLoading}
        onSubmit={handleForgotPassword}
      />

      <RegisterDialog
        open={showRegister}
        onOpenChange={setShowRegister}
        isLoading={isLoading}
        onSubmit={handleRegister}
      />
    </div>
  );
};
