"use client"
import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/pepeso.png';
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddNoteDialog from "@/components/AddNoteDialog";
import ThemeToggler from "@/components/ThemeToggler";
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'
import AIChatButton from "@/components/AIChatButton";

export default function NavBar() {
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
    const {theme} = useTheme();
    useEffect(()=>{
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === '/') {
              setShowAddNoteDialog(true)
            }
          };
          document.addEventListener('keydown', handleKeyPress);
          return () => {
            document.removeEventListener('keydown', handleKeyPress);
          };
    }, [])
    return(
        <>
        <nav className="p-4 shadow w-full h-16">
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <Link href="/notes">
                    <Image className="hidden md:block" src={logo} alt="logo" width={40} height={40} />
                </Link>
                <div className="flex items-center gap-2">
                    <UserButton afterSignOutUrl="/" appearance={{
                        baseTheme: (theme === "dark" ? dark : undefined),
                        elements: { avatarBox: { width: "2.5rem", height: "2.5rem" }}
                    }}/>
                    <ThemeToggler />
                    <Button onClick={()=>setShowAddNoteDialog(true)}>
                        <Plus size={20} className="mr-2" />
                        Add Task
                    </Button>
                    <AIChatButton />
                </div>
            </div>
        </nav>
        <AddNoteDialog open={showAddNoteDialog} setOpen={setShowAddNoteDialog} />
        </>
    )
}