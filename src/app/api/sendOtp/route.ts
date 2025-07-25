import { NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";

// function generateSixDigitOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

export async function POST(req: Request) {
  try {
    const { email,otp } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

  
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now

    // Send email via EmailJS
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        email,
        otp,
        time: expiresAt.toLocaleTimeString(),
       
      },
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    return NextResponse.json({ message: "OTP sent successfully", otp,success:true }, { status: 200 });
  } catch (error) {
    console.error("EmailJS Error:", error);
    return NextResponse.json({message:"Something went wrong",success:false }, { status: 500 });
  }
}
