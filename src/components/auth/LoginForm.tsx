"use client";
/**
 * Login form component with wallet integration
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RiGitRepositoryPrivateFill, RiUser5Fill, RiWallet3Fill } from "@remixicon/react";
import { useWallet } from "@/hooks";
import { API_ROUTES, APP_ROUTES } from "@/lib/constants";

const LOGIN_SCHEMA = z.object({
  email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  walletAddress: z.string().min(1, { message: "Wallet address is required." }),
});

type LoginFormValuesType = z.infer<typeof LOGIN_SCHEMA>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { address, handleConnect, error: walletError } = useWallet();

  const form = useForm<LoginFormValuesType>({
    resolver: zodResolver(LOGIN_SCHEMA),
    defaultValues: {
      email: "",
      password: "",
      walletAddress: "",
    },
  });

  useEffect(() => {
    handleConnect();
  }, [handleConnect]);

  useEffect(() => {
    if (address) {
      form.setValue("walletAddress", address);
    }
  }, [address, form]);

  useEffect(() => {
    if (walletError) {
      setError(walletError);
    }
  }, [walletError]);

  async function handleSubmit(data: LoginFormValuesType) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      router.push(APP_ROUTES.USER.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <RiUser5Fill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input placeholder="example@example.com" {...field} className="pl-10" />
                </div>
              </FormControl>
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
              <FormControl>
                <div className="relative">
                  <RiGitRepositoryPrivateFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input type="password" placeholder="********" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <RiWallet3Fill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input {...field} className="pl-10" readOnly />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
