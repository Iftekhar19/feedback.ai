import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // ✅ default import
import { UserCredentials } from "@/types/ApiResponse";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Username or Email", type: "text" }, // ✅ fixed key
        password: { label: "Password", type: "password" },
        
      },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials:any):Promise<any> {
        try {
          if (!credentials) return null;
          const { _id, emailId, username, isVerified, isAcceptingMessage } = credentials as UserCredentials;
          return {
            _id:_id||"",
            email: emailId||"",
            username :username||"",
            isVerified:isVerified||false,
            isAcceptingMessage:isAcceptingMessage||true
          
          };
        } catch (error) {
          console.error("Login error:", error);
         throw new Error("Login error")
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

