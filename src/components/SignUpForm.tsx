"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button, Input } from "@nextui-org/react";
import { RiCalendar2Fill, RiGitRepositoryPrivateFill, RiMailFill, RiUser5Fill, RiEye2Fill, RiEyeCloseFill } from "@remixicon/react";
import PasswordStrengthBar from 'react-password-strength-bar';

const formSchema = z.object({
  name: z.string().min(1, { message: "This field has to be filled." }),
  dob: z.string().min(1, { message: "This field has to be filled." }),
  email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

function onSubmit(values: z.infer<typeof formSchema>) {
  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  console.log(values);
}

const SignUpForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dob: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    form.setValue("password", password);
    setPassword(password);
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
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Date of Birth</FormLabel>
              <FormControl>
                <Input placeholder="DD-MM-YYYY" type="date" {...field} startContent={<RiCalendar2Fill />} />
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
        <Button type="submit" className="border-2 border-[#94C358] w-max text-white uppercase tracking-widest" variant="bordered">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
