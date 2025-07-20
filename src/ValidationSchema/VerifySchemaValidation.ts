import {z} from 'zod'
export const  verifyCodeSchema=z.object({
    otp:z.string().length(6,"Verification code must be atleast 6 characters")
})