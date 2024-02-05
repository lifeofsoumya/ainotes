import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation';

export default function Home() {
  const {userId} = auth();
  if(userId) redirect("/notes")
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className='text-5xl font-bold'>AI</h1>
        <Button size="lg" asChild>
          <Link className='font-bold text-xl' href="/notes">Open</Link>
        </Button>
    </main>
  )
}
