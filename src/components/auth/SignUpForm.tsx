"use client";
/**
 * Sign up form component with wallet integration
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button, Input, Checkbox } from "@nextui-org/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RiGitRepositoryPrivateFill, RiMailFill, RiUser5Fill, RiEye2Fill, RiEyeCloseFill, RiWallet3Fill } from "@remixicon/react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useWallet } from "@/hooks";
import { API_ROUTES, APP_ROUTES } from "@/lib/constants";

const SIGNUP_SCHEMA = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email("This is not a valid email."),
  walletAddress: z.string().min(1, { message: "Wallet address is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValuesType = z.infer<typeof SIGNUP_SCHEMA>;

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { address, handleConnect, error: walletError } = useWallet();

  const form = useForm<SignUpFormValuesType>({
    resolver: zodResolver(SIGNUP_SCHEMA),
    defaultValues: {
      name: "",
      email: "",
      walletAddress: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const password = form.watch("password");

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

  function handleTogglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  async function handleSubmit(data: SignUpFormValuesType) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      router.push(APP_ROUTES.USER.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 lg:space-y-4 flex flex-col w-max">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} startContent={<RiUser5Fill />} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Your Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" type="email" {...field} startContent={<RiMailFill />} />
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
              <FormLabel className="text-white">Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} startContent={<RiWallet3Fill />} readOnly />
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
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={isPasswordVisible ? "text" : "password"}
                    {...field}
                    startContent={<RiGitRepositoryPrivateFill />}
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  >
                    {isPasswordVisible ? <RiEye2Fill /> : <RiEyeCloseFill />}
                  </button>
                </div>
              </FormControl>
              <PasswordStrengthBar password={password} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...field}
                  startContent={<RiGitRepositoryPrivateFill />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  I agree to the <Link href="/terms" className="text-black font-semibold">Terms and conditions</Link>
                </Checkbox>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={isLoading} className="border-2 border-[#94C358] w-max text-white uppercase tracking-widest" variant="bordered">
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
