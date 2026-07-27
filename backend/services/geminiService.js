const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateAnswer(context, question) {

    const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",

        contents: `Answer the question using the following context.Context:${context} Question:${question}`,
    });

    return response.text;
}

module.exports = {
    generateAnswer,
};