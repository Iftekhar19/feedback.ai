import { Message } from "@/model/User.model"
export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessaged?:boolean,
    messages?:Array<Message>
}
export interface AppUser{
    _id?:string,
    username?:string,
    email?:string,
    password?:string,
    isVerified?:boolean,
    isAcceptingMessage?:boolean,
    verifyCode?:string
}