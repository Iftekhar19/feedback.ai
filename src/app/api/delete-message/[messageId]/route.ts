import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // your NextAuth config
import dbConnect from "@/lib/dbConnect"; // util to connect to MongoDB
import { UserModel } from "@/model/User.model"; // your user model

export async function DELETE(req: Request) {


  // Get user session
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Extract messageId from the URL
  const url = new URL(req.url);
  const messageId = url.pathname.split("/").pop();


  const userEmail = session.user.email;

  // Connect to MongoDB
  await dbConnect();
  // Pull message by ID for this user's document
  const result = await UserModel.updateOne(
    { email: userEmail },
    { $pull: { messages: { _id: messageId } } }
  );

  if (result.modifiedCount === 0) {
    return new Response(JSON.stringify({ error: "Message not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
