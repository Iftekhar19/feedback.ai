import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // ✅ default import
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Username or Email", type: "text" }, // ✅ fixed key
        password: { label: "Password", type: "password" },
        
      },

      async authorize(credentials: any): Promise<any> {
        // await dbConnect();
        try {
          const {_id,email,username,isVerified,isAcceptingMessage}=credentials
          // console.log(_id,email,username,isVerified,isAcceptingMessage)
          // const user = await UserModel.findOne({
          //   $or: [
          //     { email: credentials.email },
          //     { username: credentials.email },
          //   ],
          // });

          // if (!user) {
          //   throw new Error("Invalid username or email");
          // }

          // if (!user.isVerified) {
          //   throw new Error("User is not verified. Please verify and try again.");
          // }

          // const isPassCorrect = await bcrypt.compare(
          //   credentials.password,
          //   user.password
          // );

          // if (!isPassCorrect) {
          //   throw new Error("Incorrect password");
          // }
         
          // return {
          //   _id: user._id?.toString(),
          //   email: user.email,
          //   username: user.username,
          //   isVerified: user.isVerified,
          //   isAcceptingMessage: user.isAcceptingMessage,
          // };
          return {
            _id,
            email,
            username,
            isVerified,
            isAcceptingMessage
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // optional: redirect errors to sign-in
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
  },
};
