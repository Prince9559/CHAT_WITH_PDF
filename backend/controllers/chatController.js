const { createEmbedding } = require("../services/embeddingService");
const { searchPoints } = require("../services/qdrantService");
const { generateAnswer } = require("../services/geminiService");

// async function askQuestion(req, res) {

//     try {
//         const { question } = req.body;
//         if (!question) 
//         {
//             return res.status(400).json({
//                 success: false,
//                 message: "Question is required"
//             });
//         }

//         const questionEmbedding = await createEmbedding(question);
//         const searchResult = await searchPoints(questionEmbedding);

//         if (!searchResult.length) 
//         {
//             return res.status(404).json({
//                 success: false,
//                 message: "No relevant content found."
//             });
//         }

//         const context = searchResult.map(item => item.payload.text).join("\n\n");
//         const answer = await generateAnswer(context, question);

//         return res.status(200).json({
//             success: true,
//             answer
//         });

//     } catch (error) 
//     {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });

//     }

// }


async function askQuestion(req, res) {
    let currentStep = "Starting chat request";

    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        currentStep = "Generating question embedding";
        console.log("CHAT STEP 1:", currentStep);

        const questionEmbedding = await createEmbedding(question);

        currentStep = "Searching Qdrant";
        console.log("CHAT STEP 2:", currentStep);

        const searchResult = await searchPoints(questionEmbedding);

        console.log("QDRANT RESULTS:", searchResult?.length);

        if (!searchResult || !searchResult.length) {
            return res.status(404).json({
                success: false,
                message: "No relevant content found."
            });
        }

        currentStep = "Preparing PDF context";

        const context = searchResult
            .map(item => item.payload?.text)
            .filter(Boolean)
            .join("\n\n");

        if (!context) {
            return res.status(404).json({
                success: false,
                message: "No PDF content found."
            });
        }

        currentStep = "Generating Gemini answer";
        console.log("CHAT STEP 3:", currentStep);

        const answer = await generateAnswer(context, question);

        console.log("CHAT SUCCESS");

        return res.status(200).json({
            success: true,
            answer
        });

    } catch (error) {
        console.error("CHAT ERROR AT:", currentStep);
        console.error("CHAT ERROR:", error);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR CAUSE:", error.cause);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    askQuestion
};