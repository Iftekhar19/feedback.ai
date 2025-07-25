'use client'
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getSuggessions } from "@/lib/getSuggessions";
import { messageSchemavalidation } from "@/ValidationSchema/MessageSchemaValidation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PublicProfile() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [messages,setMessages]=useState([])

  const params=useParams();

  // Simulate suggestion loading

  // setTimeout(() => setLoadingSuggestions(false), 2000);

  const handleSend = async() => {

    const parsedMessage=messageSchemavalidation.safeParse({content:message})
    // console.log(parsedMessage)
    // console.log(parsedMessage.error?.message)
    if(parsedMessage.success)
    {
      setIsSending(true);
     try {
       await axios.post('/api/send-message',{
         username:params.dashboard,
         content:message
       }) 
        setMessage("");
     } catch (error) {
      console.log(error)
      toast.error("unable to send message",{
        position:"top-right"
      })
     }
     finally{

       setIsSending(false);
     }
    }
    else{
      toast.error(parsedMessage.error?.issues[0].message,{
        position:"top-right",
        
      })
    }
     
   
  };
  const handleSuggession=async ()=>
  {
    setLoadingSuggestions(true)
    const res=await getSuggessions();
    setMessages(res.message)
    setLoadingSuggestions(false)
  }
  useEffect(()=>
  {
    (async ()=>
    {
      const res=await getSuggessions()
      console.log(res)
      if(res.success)
      {
        setMessages(res.message)
      }
      else{
         toast.error(res.message,{
          position:"top-right"
         })
      }
      setLoadingSuggestions(false)
    })()

  },[])
  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto text-center ">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Public Profile Link</h1>
      <p className="text-gray-600 text-md mb-6">
        Send Anonymous Message to <span className="font-semibold text-indigo-600">@{params.dashboard}</span>
      </p>

      <Textarea
        placeholder="Write your anonymous message here..."
        className="mb-4 min-h-[120px] rounded-md shadow-sm border-gray-300 resize-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button
        className="w-full mb-6 text-white font-semibold cursor-pointer"
        disabled={message.trim() === "" || isSending}
        onClick={handleSend}
      >
        {isSending ? "Sending..." : "Send It"}
      </Button>

      <div className="border rounded-lg py-10 px-6 bg-white mb-6 shadow-sm">
        <p className="text-lg font-medium mb-4 text-gray-800">
          Click on any message below to select it.
        </p>
        {loadingSuggestions ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-5/6 rounded" />
            <Skeleton className="h-8 w-3/4 rounded" />
          </div>
        ) : messages.length ===0 ? (
          <p className="text-sm text-gray-500">No messages available. Try suggesting some!</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, idx) => (
              <li
                key={idx}
                className="cursor-pointer p-3 border rounded-md hover:bg-gray-100"
                onClick={() => setMessage(msg)}
              >
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button disabled={loadingSuggestions} onClick={handleSuggession} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 cursor-pointer">
       {loadingSuggestions?<><Loader2 className="h-4 w-4 animate-spin"/> Please Wait</>:"Suggest Messages"} 
      </Button>
    </div>
  );
}
