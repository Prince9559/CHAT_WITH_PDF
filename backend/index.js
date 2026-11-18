const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); 

dotenv.config();

const uploadRoute = require("./routes/uploadRoute");
const chatRoute = require("./routes/chatRoute");
const { createCollection } = require("./services/qdrantService");

const app = express();

app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Chat With PDF API Running...");
});

app.use("/api", uploadRoute);
app.use("/api", chatRoute);

async function startServer() {
    try {
        await createCollection();
        app.listen(PORT, () => {
            console.log(`🚀 Server Running On Port ${PORT}`);
        });

    } catch (error) {
        console.error("Server Startup Error:", error);
    }
}



startServer();