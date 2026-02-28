"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Sparkles, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT LOGO */}
        <Link href="/" className="flex items-center">
          <div className="rounded-full overflow-hidden border-2 border-primary shadow-[0_0_12px_rgba(255,255,255,0.15)] w-12 h-12">
            <Image
              src="/AI-Quick-Guide-Circle.png" 
              alt="Sensai Logo"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="hidden md:flex">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Industry Insights
              </Button>
            </Link>

            {/* Growth Tools */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex w-full">Build Resume</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cover-letter" className="flex w-full">Cover Letter</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview-prep" className="flex w-full">Interview Prep</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          {/* Auth Section */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" className="bg-[#6c47ff] hover:bg-[#5a3ae0]">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}