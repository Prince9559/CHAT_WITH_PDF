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
    try {
        console.log("QDRANT: Insertion started");
        console.log("QDRANT URL:", process.env.QDRANT_URL);
        console.log("TOTAL POINTS:", points.length);
        console.log("VECTOR SIZE:", points[0]?.vector?.length);

        await qdrant.upsert(COLLECTION_NAME, {
            points,
            wait: true
        });

        console.log("QDRANT: Insertion successful");

    } catch (error) {
        console.error("QDRANT INSERT ERROR:", error);
        console.error("QDRANT MESSAGE:", error.message);
        console.error("QDRANT CAUSE:", error.cause);
        console.error("QDRANT CODE:", error.cause?.code);

        throw error;
    }
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