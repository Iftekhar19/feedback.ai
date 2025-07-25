"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

 function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  

  return (
    <nav className="w-full px-6 md:px-16 py-4 border-b bg-white flex justify-between items-center">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 select-none group">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-tight group-hover:scale-105 transition-transform">
          TrueFeedback
        </span>
        <span className="inline-block px-2 py-1 rounded bg-indigo-100 text-xs font-bold text-indigo-700 ml-1 tracking-widest shadow group-hover:bg-indigo-200 transition-colors">
          AI
        </span>
      </Link>

      {/* Right: Auth Buttons or Profile */}
      <div className="flex items-center space-x-4">
        {status === "loading" ? null : session?.user ? (
          <div className="flex items-center space-x-3">
            <Avatar
              className="cursor-pointer"
              
            >
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || "User"}
              />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="cursor-pointer">
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <Button variant="ghost" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
          </>
        )}
      </div>
    </nav>
  );
}
export default React.memo(Navbar);
