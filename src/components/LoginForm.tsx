"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, } from "./ui/form";
import { Button, Input } from "@nextui-org/react";
import {RiGitRepositoryPrivateFill, RiUser5Fill} from "@remixicon/react" 

const formSchema = z.object({
    email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
    // .refine(async (e) => {
    //   // Where checkIfEmailIsValid makes a request to the backend
    //   // to see if the email is valid.
    // //   return await checkIfEmailIsValid(e);
    // }, "This email is not in our database"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return     <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col w-full container">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold text-base tracking-wide">Your Email</FormLabel>
          <FormControl>
            <Input className="rounded-xl border-zinc-500 border-[1px]" placeholder="example@example.com" type="email" {...field} startContent={<RiUser5Fill />} />
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
          <FormLabel className="font-semibold text-base tracking-wide">Password</FormLabel>
          <FormControl>
            <Input className="rounded-xl border-zinc-500 border-[1px]" placeholder="Password" type="password" {...field} startContent={<RiGitRepositoryPrivateFill />}/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" className="bg-[#94C358] font-semibold">Submit</Button>
  </form>
</Form>;
};

export default LoginForm;
