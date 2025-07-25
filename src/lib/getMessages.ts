import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"

export const getMessages=async ()=>
{
    try {
       const res=await axios.get('/api/get-messages')
       return res.data 
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        return axiosError?.response?.data
    }
}