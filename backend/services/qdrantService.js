const { QdrantClient } = require("@qdrant/js-client-rest");

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "pdf-docs";
async function createCollection() 
{
    try {
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: {
                size: 3072,
                distance: "Cosine",
            },
        });

        console.log("✅ Collection Created");

    } catch (error) {
        console.log("ℹ️ Collection already exists");
    }
}

async function insertPoints(points) {
    await qdrant.upsert(COLLECTION_NAME, {
        points,
    });
}

async function searchPoints(vector) {
    const result = await qdrant.search(COLLECTION_NAME, {
        vector,
        limit: 3,
    });

    return result;
}

module.exports = {
    createCollection,
    insertPoints,
    searchPoints,
};