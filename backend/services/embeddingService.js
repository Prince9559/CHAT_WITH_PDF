const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function createEmbedding(text) {
    try {
        console.log("GEMINI: Embedding request started");

        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: text,
        });

        console.log("GEMINI: Embedding generated");

        return response.embeddings[0].values;

    } catch (error) {
        console.error("GEMINI ERROR:", {
            message: error.message,
            cause: error.cause?.message,
            code: error.cause?.code,
            status: error.status,
        });

        throw error;
    }
}

module.exports = { createEmbedding };