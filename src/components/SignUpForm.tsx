"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button, Input, Checkbox } from "@nextui-org/react";
import { RiCalendar2Fill, RiGitRepositoryPrivateFill, RiMailFill, RiUser5Fill, RiEye2Fill, RiEyeCloseFill, RiWallet3Fill } from "@remixicon/react";
import PasswordStrengthBar from 'react-password-strength-bar';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
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

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      walletAddress: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        form.setValue('walletAddress', address);
      } catch (err) {
        console.error("Failed to connect wallet:", err);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to continue.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    form.setValue("password", newPassword);
    setPassword(newPassword);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/user/home');
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 lg:space-y-4 flex flex-col w-max">
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
                    type={showPassword ? "text" : "password"}
                    {...field}
                    onChange={handlePasswordChange}
                    startContent={<RiGitRepositoryPrivateFill />}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  >
                    {showPassword ? <RiEye2Fill /> : <RiEyeCloseFill />}
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
                  // {...field}
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
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;