import { usernameValidation } from "@/ValidationSchema/SignUpSchemaValidation";
import { z} from 'zod'
import { UserModel } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";


const UsernameQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(req:Request) {
    await dbConnect()

    try {
        const {searchParams} =new URL(req.url)
        const queryParam={
            username:searchParams.get('username')
            
        }

        // validation with zod
        const result=UsernameQuerySchema.safeParse(queryParam)
        if(!result.success)
        {
            const usernameErrors=result.error.format().username?._errors||[]
            return Response.json({
                success:false,
                message: usernameErrors?.length>0?usernameErrors.join(', ')
                :'Invalid query parameter'
            },{status:400})
        }

        const {username}=result.data;
      const existingUser=await  UserModel.findOne({username,isVerified:true})

      if(existingUser)
      {
        return Response.json({
            success:false,
            message:'Username is already taken'
        },{status:400})
      }
      return Response.json({
        success:true,
        message:'Username is unique'
      },{status:201})



        
    } catch (error) {
        console.log("error checking username",error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
    
}

