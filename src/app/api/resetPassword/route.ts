import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const {email,password}=await req.json()
    await dbConnect();
    try {
        const user=await UserModel.findOne({email})
        if(user)
        {
          const hashedPassword=await bcrypt.hash(password,10)  
          user.password=hashedPassword;
          await user.save();
          return Response.json({
            success:true,
            message:'password has been changed successfully'
          },{status:201})
        }
        else{
          return  Response.json({
                success:false,
                message:"something went wrong please try again later"
            },{status:500})
        }
        
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"something went wrong please try again later"
        },{status:500})

        
    }
}