"use client"
import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/pepeso.png';
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddNoteDialog from "@/components/AddNoteDialog";

export default function NavBar() {
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
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
        <nav className="p-4 shadow w-full px-16 h-16">
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <Link href="/notes">
                    <Image src={logo} alt="logo" width={40} height={40} />
                </Link>
                <div className="flex items-center gap-2">
                    <UserButton afterSignOutUrl="/" appearance={{
                        elements: { avatarBox: { width: "2.5rem", height: "2.5rem" }}
                    }}/>
                    <Button onClick={()=>setShowAddNoteDialog(true)}>
                        <Plus size={20} className="mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>
        </nav>
        <AddNoteDialog open={showAddNoteDialog} setOpen={setShowAddNoteDialog} />
        </>
    )
}