function chunkText(text) {

    const chunks = text.split("\n\n").filter((chunk) => chunk.trim() !== "");
    return chunks;
}

module.exports = chunkText;