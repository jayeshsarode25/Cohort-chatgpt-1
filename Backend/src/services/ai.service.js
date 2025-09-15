const { GoogleGenAI } = require("@google/genai")


const ai = new GoogleGenAI({})


async function genreateResponce(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text
}


async function generateVectors(content) {
  const responce = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config:{
      outputDimensionality: 768
    }
  })
  return responce.embeddings[0].values;
}

module.exports = {
    genreateResponce,
    generateVectors
}