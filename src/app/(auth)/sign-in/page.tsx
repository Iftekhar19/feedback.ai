"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const signInSchema = z.object({
  itentifier: z
    .string()
    .refine(
      (val) =>
        /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(val) ||
        /^[a-zA-Z0-9._]+$/.test(val),
      {
        message: "Enter a valid email or username",
      }
    ),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [apiError,setApiError]=useState({
  //   isError:false,
  //   errorMsg:""
  // })

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      itentifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    // console.log("Sign in with", data);
    let userRes = await fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify({
        identifier: data.itentifier,
        password: data.password,
      }),
    });
    userRes = await userRes.json();
    let id = "";
    if (!userRes.success) {
      id = toast.error(userRes?.message, {
        position: "top-right",
      });
      return;
    }
    const { user } = userRes;
    if (!user?.isVerified) {
      toast.error("Please verify first", {
        id: id || "",
        position: "top-right",
      });
      return;
    }
    const res = await signIn("credentials", {
      redirect: true,
      email: data.itentifier,
      password: data.password,
      callbackUrl: "/",
      _id: user?._id?.toString(),
      isVerified: user?.isVerified,
      isAcceptingMessage: user?.isAcceptingMessage,
      emailId: user?.email,
      username: user?.username,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cfd9df] to-[#e2ebf0] p-4">
      <Card className="w-full max-w-[800px]  shadow-inner bg-white border border-gray-300 flex md:flex-row sm:flex-col ">
        <CardContent className="p-6 sm:pl-8 md:pl-6 flex-1   sm:order-2 md:order-1">
          <h2 className="text-xl font-semibold text-center mb-6">Sign In</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="itentifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Username/Email"
                        className="bg-white border border-gray-300 shadow-sm"
                        {...field}
                      />
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
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="bg-white border border-gray-300 shadow-sm pr-10"
                          autoComplete="current-password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full shadow-lg mt-2">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardContent className="flex-1  flex sm:order-[-1] md:order-1">
          <Image
            src="/animations/signup.png"
            alt="Sign in animation"
            width={600}
            height={600}
            className="object-contain flex-1 "
          />
        </CardContent>
      </Card>
    </div>
  );
}
