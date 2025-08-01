import { useState } from "react";
import { EmailAuth } from "./email-auth";
import { RegisterDialog } from "./register-dialog";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/auth.store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TraditionalAuthScene = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);

  const setIsOffline = authStore((state) => state.setIsOffline);
  const setToken = authStore((state) => state.setToken);

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

          <>
            <EmailAuth
              onTokens={(tokens) => setToken(tokens.refresh)}
              onRegisterClick={() => setShowRegister(true)}
            />
          </>

          <p className="text-center text-sm text-muted-foreground flex gap-2 items-center justify-center pt-6 mt-6 border-t border-border">
            Want to explore paintress?
            <Button
              onClick={() => setShowOfflineDialog(true)}
              variant="link"
              className="p-0 h-auto font-medium"
            >
              Evaluate
            </Button>
          </p>
        </div>
      </div>

      <RegisterDialog open={showRegister} onOpenChange={setShowRegister} />

      <Dialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Risk Warning!!</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="py-4 text-[16px] leading-7">
              You're using Paintress in evaluation mode. All core features are
              available, and your data will be stored locally in your browser.
              For better data security, we recommend creating an account to sync
              your work across devices.
            </p>
          </DialogDescription>

          <DialogFooter className="flex flex-col gap-4">
            <Button
              onClick={() => setShowOfflineDialog(false)}
              variant="outline"
            >
              Go back, and create an account
            </Button>
            <Button
              onClick={() => {
                setIsOffline(true);
                setShowOfflineDialog(false);
              }}
            >
              I understand the risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
