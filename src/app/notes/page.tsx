import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";

export default async function NotesPage() {

  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map(note=>(
        <Note key={note.id} note={note} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"Don't have any Notes"}
        </div>
      )}
    </div>
  );
}
