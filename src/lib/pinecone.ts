import { Pinecone } from "@pinecone-database/pinecone";

const pineConeAPIKey = process.env.PINECONE_API_KEY;

if(!pineConeAPIKey) throw Error("PineCone API key not set")

const pinecone = new Pinecone({
    // environment: 'gcp-starter',
    apiKey: pineConeAPIKey
})

export const notesIndex = pinecone.Index('ainotes');