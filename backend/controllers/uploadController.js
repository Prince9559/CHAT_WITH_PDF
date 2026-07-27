const fs = require("fs");
const pdfParse = require("pdf-parse");

const { createEmbedding } = require("../services/embeddingService");
const { insertPoints } = require("../services/qdrantService");
const chunkText = require("../utils/chunkText");

async function uploadPDF(req, res) {
    try {

    if (!req.file) 
        {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF."
            });
        }

        // Read PDF
        const dataBuffer = fs.readFileSync(req.file.path);

        // Extract Text
        const pdfData = await pdfParse(dataBuffer);

        // Split into Chunks
        const chunks = chunkText(pdfData.text);

        const points = [];

        for (let i = 0; i < chunks.length; i++) {

            const embedding = await createEmbedding(chunks[i]);

            points.push({
                id: Date.now() + i,   // abhi simple unique id
                vector: embedding,
                payload: {
                    text: chunks[i]
                }
            });

        }

        // Save to Qdrant
        await insertPoints(points);

        return res.status(200).json({
            success: true,
            message: "PDF Uploaded Successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

module.exports = {
    uploadPDF
};