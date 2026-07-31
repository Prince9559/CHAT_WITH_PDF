const { createEmbedding } = require("../services/embeddingService");
const { searchPoints } = require("../services/qdrantService");
const { generateAnswer } = require("../services/geminiService");

async function askQuestion(req, res) {

    try {
        const { question } = req.body;
        if (!question) 
        {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        const questionEmbedding = await createEmbedding(question);
        const searchResult = await searchPoints(questionEmbedding);

        if (!searchResult.length) 
        {
            return res.status(404).json({
                success: false,
                message: "No relevant content found."
            });
        }

        const context = searchResult.map(item => item.payload.text).join("\n\n");
        const answer = await generateAnswer(context, question);

        return res.status(200).json({
            success: true,
            answer
        });

    } catch (error) 
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

module.exports = {
    askQuestion
};