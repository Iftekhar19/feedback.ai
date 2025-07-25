import dbConnect from "@/lib/dbConnect";
import { sendEmail } from "@/lib/SendOtpEmail";
import { UserModel } from "@/model/User.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email } = await req.json();
    const user = await UserModel.findOne({ email });
    if (user) {
     const otp= Math.floor(100000 + Math.random() * 900000).toString();
     user.verifyCode=otp;
     user.verifyCodeExpiry=new Date(Date.now() + 3600000)
    await  user.save()
    await sendEmail(email,otp)
    return Response.json({
        success:true,
        message:`OTP has been resend successfully to the ${email}`
    })
    } else {
      return Response.json({
        success: false,
        message: "Something went rong please try again later",
      });
    }
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message: "Unexpected error occured7"
    });
  }
}
