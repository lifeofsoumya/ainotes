import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if(!apiKey) throw Error("OpenAI API key not set")

const openai = new OpenAI({ apiKey })

export default openai

export async function getEmbeddings(text: string){
    const res = await openai.embeddings.create({
        model: 'text-embedding-ada-002', // successor version is text-embedding-3-small
        input: text
    })

    const embedding = res.data[0].embedding;
    if(!embedding) throw Error("Error generating embedding.")
    // console.log(embedding, ' embedding')
    return embedding;
}