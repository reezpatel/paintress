import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordAuthProps {
  email: string;
  isLoading: boolean;
  onPasswordSignIn: (password: string) => void;
  onMagicLink: () => void;
  onForgotPassword: () => void;
  onResetAuth: () => void;
}

export const PasswordAuth = ({
  email,
  isLoading,
  onPasswordSignIn,
  onMagicLink,
  onForgotPassword,
  onResetAuth,
}: PasswordAuthProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    onPasswordSignIn(data.password);
  };

  return (
    <div className="space-y-10">
      <div className="text-center text-sm mb-8 flex justify-between">
        <p className="text-muted-foreground">Sign in to {email}</p>
        <Button
          onClick={onResetAuth}
          variant="link"
          className="text-xs p-0 h-auto"
        >
          Use a different email
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-12"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground h-8 w-8"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
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
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between">
        <Button
          onClick={onForgotPassword}
          variant="link"
          className="text-sm p-0 h-auto"
        >
          Forgot password?
        </Button>
        <Button
          onClick={onMagicLink}
          disabled={isLoading}
          variant="link"
          className="text-sm p-0 h-auto"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin inline" />
          ) : (
            "Sign in with magic link"
          )}
        </Button>
      </div>
    </div>
  );
};
