import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"

export const  getSuggessions=async()=>
{
 try {
    const res=await axios.post('/api/suggesstions')
    return res.data
 } catch (error) {
  const axiosError = error as AxiosError<ApiResponse>
   return axiosError?.response?.data || {
    success:false,
    message :"Unexpected error occured"
   }
 }
}