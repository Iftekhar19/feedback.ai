import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request:Request) {
  await dbConnect()
  try {
    const {identifier,password}=await request.json();
    if(!identifier || !password)
    {
           return Response.json({
            success:false,
            message:"Please provide credentials"
        },{status:401})
    }
    const user=await UserModel.findOne({
        $or:[
            {username:identifier},
            {email:identifier}
        ]
    })
    if(!user)
    {
        return Response.json({
            success:false,
            message:"Invalid username or password"
        },{status:401})
    }

    const isPassCorrect=await bcrypt.compare(password,user.password)
    if(!isPassCorrect)
    {
         return Response.json({
            success:false,
            message:"Invalid username or password"
        },{status:401})
    }
    return Response.json({
        success:true,
        user:{
           _id: user._id?.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,  
        }
    },{status:200})
    
  } catch (error) {
    console.log(error)
    return Response.json({
        success:false,
        message:"Unexpected error occured"
    },{status:501})
  }    
}