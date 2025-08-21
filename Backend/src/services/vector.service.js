const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const cohortChatGptIndex = pc.Index("cohort-chatgpt");

async function createMemory({vectors, metadata, messageID}) {
  await cohortChatGptIndex.upsert([
    {
      id: messageID,
      values: vectors,
      metadata,
    },
  ]);
}

async function queryMemory({queryVector , limit=5, metadata}){

    const data = await cohortChatGptIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata? {metadata} : undefined,
        includeMetadata: true
    })
}


module.exports = { createMemory, queryMemory }