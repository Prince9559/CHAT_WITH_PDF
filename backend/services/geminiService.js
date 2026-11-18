// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// async function generateAnswer(context, question) {
//     const response = await ai.models.generateContent({
//         model: "gemini-3.5-flash",
//         contents: `Answer the question using the following context.Context:${context} Question:${question}`,
//     });

//     return response.text;
// }

// module.exports = {
//     generateAnswer,
// };


const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateAnswer(context, question) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`GEMINI ANSWER: Attempt ${attempt}`);

            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: `
                    Answer the question using the following context.

                    Context:
                    ${context}

                    Question:
                    ${question}
                `,
            });

            console.log("GEMINI ANSWER GENERATED");

            return response.text;

        } catch (error) {
            const status = error.status || error.code;

            console.error("GEMINI ANSWER ERROR:", {
                status,
                message: error.message,
                attempt
            });

            const retryable = [429, 500, 502, 503, 504]
                .includes(Number(status));

            if (!retryable || attempt === maxRetries) {
                throw error;
            }

            const delay = 1000 * Math.pow(2, attempt - 1);

            console.log(`Retrying after ${delay}ms`);

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }
}

module.exports = {
    generateAnswer
};
