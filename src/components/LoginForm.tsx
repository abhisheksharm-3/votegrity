"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button, Input } from "@nextui-org/react";
import { RiGitRepositoryPrivateFill, RiUser5Fill, RiWallet3Fill } from "@remixicon/react";
import { ethers } from 'ethers';

const formSchema = z.object({
  email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  walletAddress: z.string().min(1, { message: "Wallet address is required." }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      walletAddress: "",
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      console.log("Login successful:", result);
      // Handle successful login (e.g., redirect to dashboard)
    } catch (err) {
      console.error("Error during login:", err);
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} startContent={<RiUser5Fill />} />
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
                <Input type="password" placeholder="********" {...field} startContent={<RiGitRepositoryPrivateFill />} />
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
                <Input {...field} startContent={<RiWallet3Fill />} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;