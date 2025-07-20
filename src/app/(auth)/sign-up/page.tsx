"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { verifyCodeSchema } from "@/ValidationSchema/VerifySchemaValidation";
import { SignUpValidation } from "@/ValidationSchema/SignUpSchemaValidation";
import { useRouter } from "next/navigation";


type SignupFormData = z.infer<typeof SignUpValidation>;


type OtpFormData = z.infer<typeof verifyCodeSchema>;



export default function SignupPage() {
  const [showOTP, setShowOTP] = useState(false);
  const [timer, setTimer] = useState(60);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [emailId,setEMailId]=useState("")
  const router=useRouter()
  const baseUrl=process.env.BASE_URL

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
    if (showOTP) {
      otpForm.setValue("otp", "".padEnd(6, " "));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      setTimer(60);
    }
  }, [showOTP]);

  useEffect(() => {
    if (!showOTP || timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const handleSignup: SubmitHandler<SignupFormData> = async(data) => {
    console.log("Registering:", data);
   
     const isUnique=await fetch(`/api/check-username-unique?username=${data.username}`)
     if(isUnique.ok)
     {

      const isRegister=await fetch(`/api/register`,{
        method:"POST",
        body:JSON.stringify(data)
      })
      if(isRegister.ok)
      {
        console.log('Register successfully')
        setEMailId(data.email)
        setShowOTP(true)
      }
      else{
        const data=await isRegister.json();
        signupForm.setError('username',{
          type:"mannual",
          message:data.message
        })
      }
          
       
     }
     else{
       const data=await isUnique.json();
        signupForm.setError('username',{
          type:"mannual",
          message:data.message
        })
     }
    
   
    // setShowOTP(true);
  };

  const handleOTPSubmit: SubmitHandler<OtpFormData> = async(data) => {
    console.log("Verifying OTP:", data.otp);
    console.log(emailId)
    if(data.otp.trim()==="")
    {
       otpForm.setError('otp',{
        type:"mannual",
        message:'Please enter otp'
       })
    }
    const result =await fetch(`/api/verifyCode`,{
       method:'POST',
       body:JSON.stringify({email:emailId,otp:data.otp})
    })
    const resultData=await result.json()
    if(!resultData.success)
    {
      //  console.log(resultData.message)
       otpForm.setError('otp',{
        type:"mannual",
        message:resultData.message
       })
       return;
    }
    else{
      // console.log(await resultData)

      router.push('/sign-in')
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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
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
      <Card className="w-full max-w-md rounded-2xl shadow-inner bg-[#fcfcfcda] border border-gray-300">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-center mb-4">{showOTP ? "Verify OTP" : "Sign Up"}</h2>
          {!showOTP ? (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input className="bg-[#fcfcfcda] border-none shadow-inner" placeholder="Enter your username..." {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="bg-[#fcfcfcda] border-none shadow-inner" placeholder="Enter your email..." {...field}  />
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
                        <Input type="password" className="bg-[#fcfcfcda] border-none shadow-inner" placeholder="Enter your password..." {...field} autoComplete="new-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-2 shadow-lg">Sign Up</Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-4">
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
                              ref={(el) => (otpRefs.current[i] = el)}
                              className="w-10 h-12 text-center rounded-md bg-[#fcfcfcda] border border-gray-300 shadow-inner"
                              value={field.value?.[i] || ""}
                              onPaste={handlePaste}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const current = field.value.split("");
                                current[i] = val;
                                const updated = current.join("");
                                otpForm.setValue("otp", updated);
                                if (val && i < 5) otpRefs.current[i + 1]?.focus();
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
                  <span className="text-gray-600">{timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive it?"}</span>
                  <Button type="button" variant="link" className="px-2" onClick={handleResend} disabled={timer > 0}>
                    Resend OTP
                  </Button>
                </div>
                <Button type="submit" className="w-full mt-2 shadow-lg">Verify OTP</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
