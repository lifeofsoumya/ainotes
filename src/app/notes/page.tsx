import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";

export default async function NotesPage() {

  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div>
      <pre>{JSON.stringify(allNotes)}</pre>
    </div>
  );
}
