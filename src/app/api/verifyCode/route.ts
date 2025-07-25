import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";

export async function POST(req: Request) {
  const { otp, email } = await req.json();
 console.log(otp)
  await dbConnect();
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const now = new Date();
      const expiryDate = new Date(user.verifyCodeExpiry);
      if (now > expiryDate) {
        return Response.json({
          success: false,
          message: "OTP has expired ! please resend otp",
        },{status:501});
      }
      if (otp !== user?.verifyCode) {
        return Response.json({
          success: false,
          message: "Incorrect OTP",
        },{status:401});
      }
 
      user.verifyCode='000000'
      user.isVerified=true

      await user.save();

    //   await UserModel.findByIdAndUpdate(user?._id, {
    //     verifyCode: "000000",
    //     isVerified: true,
    //   });
      return Response.json({
        success: true,
        message: "OTP verification completed",
      },{status:200});
    } else {
      return Response.json({
        success: false,
        message: "Something went wrong please rty again later",
      },{status:500});
    }
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message:"Unexpected error occured",
    },{status:500});
  }
}
