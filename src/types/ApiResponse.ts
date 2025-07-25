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
    email:string,
    password:string,
    isVerified?:boolean,
    isAcceptingMessage?:boolean,
    verifyCode?:string
}
 export type UserCredentials = {
  _id?: string;
  emailId?: string;
  username?: string;
  isVerified?: boolean;
  isAcceptingMessage?: boolean;
  email:string;
  password:string;

};
export type AuthUser = {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessage: boolean;
};