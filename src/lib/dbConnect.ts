import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number
}


const connection :ConnectionObject={

}
async function dbConnect():Promise<void> {
   if(connection.isConnected ){
    console.log("Already connected to database")
    return
   }

   try {
    // console.log(process.env.NEXT_PUBLIC_MONGODB_URI)
   const db= await mongoose.connect(process.env.MONGODB_URI,{
    
   })

  connection.isConnected= db.connections[0].readyState
  console.log("DB connect successfully")
    
   } catch (error:any) {
    console.log(error?.message)
    process.exit(1)
   }
}

export default dbConnect;