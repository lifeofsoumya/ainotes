import prisma from "@/lib/db/prisma";
import openai, { getEmbeddings } from "@/lib/openai";
import { notesIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request){
    try {
        const { messages } = await req.json()

        const messagesTruncated = messages.slice(-6); // take last 6 convo because sending all the old chats might be overwhelming and might generate incorrent embedding
        const embeddingFromChat = await getEmbeddings(
            messagesTruncated.map((message: any) => message.content).join("\n")
        )
        const {userId } = auth();

        const vectorQueryResponse = await notesIndex.query({
            vector:embeddingFromChat,
            topK: 7,
            filter: {userId}
        })

        const relevantNotes = await prisma.note.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map(match=> match.id)
                }
            }
        })

        console.log("relevant notes found ", relevantNotes);

        const systemMessage: ChatCompletionMessage = {
            role: "assistant",
            content: 
            "You are an intelligent personal assistant. You answer user's question based on their exising notes. " + 
            "The relevant notes for this query are:\n" +
            relevantNotes.map(note => `Title: ${note.title}\n\nContent:\n${note.content}`).join("\n\n"),
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [systemMessage, ...messagesTruncated]
        })

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.error(error);
        return Response.json({error: 'Internal server error'}, {status: 500}) 
    }
}