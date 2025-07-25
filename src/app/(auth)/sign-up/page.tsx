"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifyCodeSchema } from "@/ValidationSchema/VerifySchemaValidation";
import { SignUpValidation } from "@/ValidationSchema/SignUpSchemaValidation";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type SignupFormData = z.infer<typeof SignUpValidation>;

type OtpFormData = z.infer<typeof verifyCodeSchema>;

export default function SignupPage() {
  const [showOTP, setShowOTP] = useState(false);
  const [timer, setTimer] = useState(60);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [emailId, setEMailId] = useState("");
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingUserMsg, setCheckingUserMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // const baseUrl = process.env.BASE_URL;

  const debounced = useDebounceCallback(setUsername, 500);

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      otp: "".padEnd(6, " "),
    },
  });

  useEffect(() => {
    (async () => {
      if (username) {
        try {
          setCheckingUsername(true);
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          const data = response.data;
          setCheckingUserMsg(data.message);
          console.log(data);
        } catch (error) {
          console.log(error);
          setCheckingUserMsg(
             "Error while checking user"
          );
        } finally {
          setCheckingUsername(false);
        }
      }
    })();
  }, [username]);
  useEffect(() => {
    if (showOTP) {
      otpForm.setValue("otp", "".padEnd(6, " "));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      setTimer(60);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOTP]);

  useEffect(() => {
    if (!showOTP || timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const handleSignup: SubmitHandler<SignupFormData> = async (data) => {
    console.log("Registering:", data);

    try {
      setLoading(true);
      await axios.post("/api/register", data);
      setEMailId(data.email);
      setShowOTP(true);
    } catch (error) {
      console.log(error);
      toast.error("User already exist",{
        position:"top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit: SubmitHandler<OtpFormData> = async (data) => {
    console.log("Verifying OTP:", data.otp);
    console.log(emailId);
    if (data.otp.trim() === "") {
      otpForm.setError("otp", {
        type: "mannual",
        message: "Please enter otp",
      });
    }
    try {
      setLoading(true);
       await axios.post("/api/verifyCode", {
        email: emailId,
        otp: data.otp,
      });
      router.push("/sign-in");
    } catch (error) {
      console.log(error)
      otpForm.setError("otp", {
        type: "manual",
        message:"Unexpected error occured",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    console.log("Resend OTP");
    otpForm.setValue("otp", "".padEnd(6, " "));
    otpRefs.current.forEach((ref) => ref?.setSelectionRange(0, 0));
    otpRefs.current[0]?.focus();
    setTimer(60);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      otpForm.setValue("otp", pasted);
      pasted.split("").forEach((char, i) => {
        if (otpRefs.current[i]) {
          otpRefs.current[i]!.value = char;
        }
      });
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#dee0e2] to-[#e2ebf0] p-4">
      <Card className="w-full max-w-3xl rounded-2xl shadow-inner bg-[#fcfcfcda] border border-gray-300 flex flex-col md:flex-row">
        {/* Left Side: Illustration */}
        <CardContent className="hidden md:flex flex-col items-center justify-center flex-1  rounded-l-2xl p-0 ml-2">
          <Image
            src="/animations/sign-in.png"
            alt="Sign up illustration"
            width={420}
            height={420}
            className="object-contain w-[340px] h-[340px] mt-8 mb-4"
            priority
          />
          <div className="text-center px-6 pb-8">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              Join TrueFeedback!
            </h3>
            <p className="text-gray-600 text-sm">
              Create your account and start collecting feedback.
            </p>
          </div>
        </CardContent>
        {/* Right Side: Form */}
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
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
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            {showOTP ? "Verify OTP" : "Sign Up"}
          </h2>
          {!showOTP ? (
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[#fcfcfcda] border-none shadow-inner"
                            placeholder="Enter your username..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                              if (e.target.value == "") setCheckingUserMsg("");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    {checkingUsername && <Loader2 className="animate-spin" />}
                    {checkingUserMsg && !checkingUsername && (
                      <span
                        className={` ml-2 ${checkingUserMsg === "Username is unique" ? "text-green-500" : "text-red-500"} text-[12px]`}
                      >
                        {checkingUserMsg}
                      </span>
                    )}
                  </div>
                </div>
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#fcfcfcda] border-none shadow-inner"
                          placeholder="Enter your email..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="bg-[#fcfcfcda] border-none shadow-inner pr-10"
                            placeholder="Enter your password..."
                            {...field}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 shadow-lg cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2 inline" />
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/sign-in"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Sign in
                    </a>
                  </span>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <div className="flex justify-between gap-2">
                          {[...Array(6)].map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={1}
                              ref={(el) => {
                                otpRefs.current[i] = el;
                              }}
                              className="w-10 h-12 text-center rounded-md bg-[#fcfcfcda] border border-gray-300 shadow-inner"
                              value={field.value?.[i] || ""}
                              onPaste={handlePaste}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const current = field.value.split("");
                                current[i] = val;
                                const updated = current.join("");
                                otpForm.setValue("otp", updated);
                                if (val && i < 5)
                                  otpRefs.current[i + 1]?.focus();
                              }}
                              onKeyDown={(e) => {
                                const current = field.value.split("");
                                if (e.key === "Backspace") {
                                  if (field.value[i]) {
                                    current[i] = "";
                                    otpForm.setValue("otp", current.join(""));
                                  } else if (i > 0) {
                                    otpRefs.current[i - 1]?.focus();
                                    current[i - 1] = "";
                                    otpForm.setValue("otp", current.join(""));
                                  }
                                  e.preventDefault();
                                } else if (e.key >= "0" && e.key <= "9") {
                                  current[i] = e.key;
                                  otpForm.setValue("otp", current.join(""));
                                  if (i < 5) otpRefs.current[i + 1]?.focus();
                                  e.preventDefault();
                                }
                              }}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {timer > 0
                      ? `Resend OTP in ${timer}s`
                      : "Didn't receive it?"}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="px-2"
                    onClick={handleResend}
                    disabled={timer > 0}
                  >
                    Resend OTP
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Please wait
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
