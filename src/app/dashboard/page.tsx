'use client'
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { getMessages } from "@/lib/getMessages";
import axios from "axios";
import dayjs from "dayjs";
import { Copy, RefreshCcw, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Simple modal component
function DeleteModal({ open, onClose, onConfirm, messageText }: { open: boolean, onClose: () => void, onConfirm: () => void, messageText: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h4 className="text-lg font-semibold mb-2">Delete Message?</h4>
        <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this message?</p>
        <p className="text-xs text-gray-500 mb-4 italic">&quot;{messageText}&quot;</p>
        <div className="flex justify-end gap-2">
          <Button className="cursor-pointer" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button className="cursor-pointer" variant="destructive" size="sm" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [messages, setMessages] = useState([
  
  ]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState<string>("");
  const [loading,setLoading]=useState(false)
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [selectMsg,setSelectMsg]=useState("")
   const { data: session } = useSession()
  const handleRefresh=async ()=>
  {
    setLoading(true)
    const res=await getMessages()
   if(res.success) 
   {
    // console.log(res.messages)
    setMessages(res.messages)
   }
   else{
    setMessages([])
   }
   setLoading(false)

  }
  const handleSwitch = async (checked: boolean) => {
      try {
        const res=await axios.post('/api/accept-message',{
           acceptMessage: checked
        })
        console.log(res.data)
        setAcceptMessages(checked)
      } catch (error) {
        console.log(error)
        toast.error("Uexpected error",{position:"top-right"})
      }
  }
  const handleDeleteClick = (id: string) => {
    setSelectedMsgId(id);
      const temp:Array<{_id:string,content:string,createdAt:string}> = messages.filter((msg:{_id:string,content:string,createdAt:string}) => msg._id === id);
      if(temp.length>0)
      {
        setSelectMsg(temp[0].content)
      }
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async() => {
    try {
      await axios.delete(`/api/delete-message/${selectedMsgId}`) 
      setMessages((msgs) => msgs?.filter((msg:{_id:string,content:string,createdAt:string}) => msg._id !== selectedMsgId));
    } catch (error) {
      console.log(error)
      toast.error("Unable to delete the message",{position:"top-right"})
    }
    finally{

      setDeleteModalOpen(false);
      setSelectedMsgId("");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedMsgId("");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.username) {
      const url = `${window.location.protocol}//${window.location.host}/u/${session.user.username}`;
      setShareUrl(url);
    }
  }, [session?.user?.username]);

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Profile URL has been copied to clipboard', {
        position: "top-right"
      });
    }
  };

  useEffect(()=>
{
    (async ()=>
    {
      try {

        const res=await axios.get('/api/accept-message')
        console.log(res?.data?.isAcceptingMessage)
        setAcceptMessages(res?.data?.isAcceptingMessage)
        
      } catch (error) {
        console.log( "unexpected error occured",error)
      }  
    })()

},[])
useEffect(()=>
{
  (async ()=>
{
  setLoading(true)
   const res=await getMessages()
   if(res.success)
   {
    // console.log(res.messages)
    setMessages(res.messages)
   }
   setLoading(false)

   
})()
},[])


  // Number of skeletons to show while loading
  const skeletonCount = 4;

  return (
    <div className="h-screen flex flex-col bg-white ">
        <Navbar/>
        <div className="flex-1 py-4 md:py-8 px-6 md:px-16 overflow-auto">
       <h1 className="text-2xl font-bold">User Dashboard</h1>
       <p className="text-gray-500 mb-6">Manage your feedback and messages</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-1 border rounded-xl p-6 shadow-sm self-start">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <Avatar className="h-16 w-16 text-lg">
              <AvatarFallback>{session?.user.username?.charAt(0).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold">{session?.user.username}</h2>
              <p className="text-sm text-gray-500">Feedback Manager</p>
            </div>
            <Separator className="my-4" />
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Accept Messages</span>
            <Switch checked={acceptMessages} onCheckedChange={handleSwitch}  className="cursor-pointer"/>
          </div>
          <Separator className="my-6" />

          <div className="text-sm font-medium text-gray-600 mb-2">Your Unique Link</div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-full px-3 py-3 rounded border bg-gray-50 text-sm text-gray-800 select-all">
              {shareUrl}
            </div>
            <Button onClick={handleCopy} variant="default" size="default" className="w-full py-5 cursor-pointer">
              <Copy className="w-4 h-4 mr-1" /> Copy Link
            </Button>
          </div>
          {/* <Separator className="my-6" /> */}
        </div>

        {/* Right Panel - Messages */}
        <div className="md:col-span-3 border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Messages</h3>
            <Button variant="ghost" size="icon" className={`cursor-pointer`} onClick={handleRefresh}>
              <RefreshCcw className={`w-5 h-5 ${loading ?'animate-spin':''}` } />
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: skeletonCount }).map((_, idx) => (
                <Skeleton key={idx} className="h-20 w-full rounded-lg" />
              ))
            ) : (Array.isArray(messages) && messages.length === 0) ? (
              <div className="text-center text-gray-400 font-bold py-12 text-base">
                No messages yet.
              </div>
            ) : (
              Array.isArray(messages) && messages.map((msg:{_id:string,content:string,createdAt:string}) => (
                <div
                  key={msg._id}
                  className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
                >
                  <div className="gap-5 flex flex-col">
                    <p className="text-base font-medium mb-2">{msg.content}</p>
                    <p className="text-xs text-gray-500">{dayjs(msg.createdAt).format('MMM D, YYYY h:mm A')}</p>
                  </div>
                  <Button variant="destructive" size="icon" className="cursor-pointer" onClick={() => handleDeleteClick(msg._id)}>
                    <Trash2 className="w-4 h-4 " />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
        </div>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        messageText={selectMsg || ""}
      />
    </div>
  );
}


