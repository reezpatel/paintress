import { Loader2, Lock, Mail } from "lucide-react";
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
} from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { $api } from "@/lib/fetch";
import { useEffect } from "react";

const emailSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailAuthProps {
  onRegisterClick: () => void;
  onTokens: (tokens: { access: string; refresh: string }) => void;
}

export const EmailAuth = ({ onRegisterClick, onTokens }: EmailAuthProps) => {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: login,
    isPending,
    error,
    data,
  } = $api.useMutation("post", "/api/v1/auth/login", {
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data: EmailFormData) => {
    login({
      body: {
        email: data.email,
        password: data.password,
      },
    });
  };

  useEffect(() => {
    if (data?.access_token && data?.refresh_token) {
      onTokens({
        access: data.access_token,
        refresh: data.refresh_token,
      });
    }
  }, [data, onTokens]);

  return (
    <div className="space-y-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-red-500">
              {error?.detail as unknown as string}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-semibold tracking-wide"
            size="lg"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

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
