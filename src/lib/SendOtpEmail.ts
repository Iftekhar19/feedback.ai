import { ApiResponse } from "@/types/ApiResponse";
import emailjs from "@emailjs/nodejs"

export const sendEmail=async(
    recipientEmail:string,
    otp:string,
):Promise<ApiResponse>=>
{
   try {
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

   
    emailjs.send(process.env.EMAILJS_SERVICE_ID!,process.env.EMAILJS_TEMPLATE_ID!,{
        otp,
        email:recipientEmail,
        time:fifteenMinutesLater.toLocaleTimeString()
    },{publicKey:process.env.EMAILJS_PUBLIC_KEY})
    return {
        message:"Email has been sent successfully",
        success:true
    }
    
   } catch (error) {
    console.log(error)
    return {
        success:false,
        message:error.message
    }
   }
}