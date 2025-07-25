import dbConnect from "@/lib/dbConnect";
import { sendEmail } from "@/lib/SendOtpEmail";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const isExist = await UserModel.findOne({ email, isVerified: true });
    if (isExist) {
      return Response.json(
        {
          success: false,
          message: "User already exist",
        },
        { status: 400 }
      );
    }

    const existUserByemail = await UserModel.findOne({ email });

    

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existUserByemail) {
      if (existUserByemail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existUserByemail.password = hashedPassword;
        existUserByemail.verifyCode = verifyCode;
        existUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existUserByemail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        verifyCode,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }
    const emailResponse = await sendEmail(email, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { succes: false, message: emailResponse?.message || "" },
        { status: 201 }
      );
    }

    return Response.json({
      success:true,
      message:`User created successfully and verification code has been sent successfully to ${email}`
    })
  } catch (error) {
    console.log("Error registering user",error);
    return Response.json(
      {
        success: false,
        message: "Error registering user"
      },
      {
        status: 500,
      }
    );
  }
}
