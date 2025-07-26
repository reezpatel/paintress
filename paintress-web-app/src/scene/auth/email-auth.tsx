import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const emailSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailAuthProps {
  isLoading: boolean;
  onEmailSubmit: (email: string) => void;
  onGoogleSignIn: () => void;
  onRegisterClick: () => void;
}

export const EmailAuth = ({
  isLoading,
  onEmailSubmit,
  onGoogleSignIn,
  onRegisterClick,
}: EmailAuthProps) => {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: EmailFormData) => {
    onEmailSubmit(data.email);
  };

  return (
    <div className="space-y-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!form.formState.isValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Continue with email"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm ">
          <span className="px-4 text-muted-foreground bg-background">
            or continue with
          </span>
        </div>
      </div>

      <Button
        onClick={onGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground flex gap-2 items-center justify-center">
        Don't have an account?
        <Button
          onClick={onRegisterClick}
          variant="link"
          className="p-0 h-auto font-medium"
        >
          Sign up
        </Button>
      </p>
    </div>
  );
};
