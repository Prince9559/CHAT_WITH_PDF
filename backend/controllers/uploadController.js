const fs = require("fs");
const pdfParse = require("pdf-parse");

const { createEmbedding } = require("../services/embeddingService");
const { insertPoints } = require("../services/qdrantService");
const chunkText = require("../utils/chunkText");

async function uploadPDF(req, res) {
    try {

        console.log("STEP 1: PDF Parsing Successful");
    if (!req.file) 
        {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF."
            });
        }
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const chunks = chunkText(pdfData.text);

        const points=[];

        for (let i=0;i<chunks.length; i++) 
            {
            
            console.log("STEP 2: Generating Embedding", i);    
            const embedding = await createEmbedding(chunks[i]);
            console.log("STEP 3: Embedding Generated", i);

            points.push({
                id: Date.now() + i,   
                vector: embedding,
                payload: {
                    text: chunks[i]
                }
            });

        }
        console.log("STEP 4: Inserting Data Into Qdrant");
        await insertPoints(points);
        console.log("STEP 5: Qdrant Insert Successful");

        return res.status(200).json({
            success: true,
            message: "PDF Uploaded Successfully"
        });

    }catch (error) {
    console.error("PDF UPLOAD ERROR:", error.stack || error);

    return res.status(500).json({
        success: false,
        message: error.message
    });
}
}

module.exports = {
    uploadPDF
};