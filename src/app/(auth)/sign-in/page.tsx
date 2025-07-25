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
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      itentifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setLoading(true);
    const userRes = await fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify({
        identifier: data.itentifier,
        password: data.password,
      }),
    });
    const res = await userRes.json();
    let id;
    if (!res?.success) {
      id = toast.error(res?.message, {
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    const { user } = res;
    if (!user?.isVerified) {
      toast.error("Please verify first", {
        id: id || "",
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    await signIn("credentials", {
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
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cfd9df] to-[#e2ebf0] p-1 md:p-4">
      <Card className="w-full max-w-[800px] shadow-inner bg-white border border-gray-300 flex md:flex-row sm:flex-col">
        {/* Left Side: Illustration */}
        <CardContent className="flex-1 ml-2 flex flex-col items-center justify-center rounded-l-lg p-0 sm:order-[-1] md:order-1">
          <Image
            src="/animations/animate.png"
            alt="Sign in animation"
            width={320}
            height={320}
            className="object-contain w-72 h-72 mt-8 mb-4"
            priority
          />
          <div className="text-center px-6 pb-8">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              Welcome Back!
            </h3>
            <p className="text-gray-600 text-sm">
              Sign in to access your dashboard and manage your feedback.
            </p>
          </div>
        </CardContent>
        {/* Right Side: Form */}
        <CardContent className="p-6 sm:pl-8 md:pl-6 flex-1 sm:order-2 md:order-1 flex flex-col justify-center">
          {/* Company Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 tracking-tight drop-shadow">
                TrueFeedback
              </span>
              <span className="inline-block px-2 py-1 rounded bg-indigo-100 text-xs font-bold text-indigo-700 ml-1 tracking-widest shadow">
                AI
              </span>
            </div>
            <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-80"></div>
          </div>
          <h2
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            Sign In
          </h2>
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
              <Button
                type="submit"
                className="w-full shadow-lg mt-2 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2 inline" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center mt-0">
                <span className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
