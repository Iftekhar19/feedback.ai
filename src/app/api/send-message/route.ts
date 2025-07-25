import dbConnect from "@/lib/dbConnect";
import { Message, UserModel } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "Currently user not accepting messages",
        },
        { status: 500 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message)
    await user.save();
    return Response.json({
        success:true,
        message:'Message sent successfully'
    },{status:201})
  } catch (error) {
    console.log("Error while adding message",error);
    return Response.json(
      {
        success: false,
        message: "Error while addinh message",
      },
      { status: 500 }
    );
  }
}
