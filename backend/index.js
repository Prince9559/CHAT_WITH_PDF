const express=require('express');
const multer=require('multer');
const pdfParse=require('pdf-parse');
const fs=require('fs');
const {GoogleGenAI}=require('@google/genai');
const {QdrantClient}=require('@qdrant/js-client-rest');
require('dotenv').config();

const PORT=process.env.PORT || 3000;

const app=express();

const upload=multer({dest:"uploads/"});

const ai=new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
})

async function createEmbedding(text) {
     const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
    });

    return response.embeddings[0].values;
}

const qdrant =new  QdrantClient({
    url:process.env.QDRANT_URL,
    apiKey:process.env.QDRANT_API_KEY
})

function cosineSimilarity(vecA,vecB){
    let dotProduct=0;

    for(let i=0;i< vecA.length;i++){
        dotProduct+=vecA[i]*vecB[i];
    }
    return dotProduct;
}

app.get('/',(req,res)=>{
res.send("Hello World")
})

app.get('/create-collection',async(req,res)=>{

    try{

        await qdrant.createCollection('pdf-docs',{
            vectors:{
                size:3072,
                distance:"Cosine",
            },
        })
        res.send('Collection is created');

    }catch(err){
        console.log(err);
        res.send(500).send(err);
    }
})

app.post('/upload',upload.single("pdf"),async (req,res)=>{
console.log(req.file);

try{

const dataBuffer=fs.readFileSync(req.file.path)
const pdfData=await pdfParse(dataBuffer);
const text=pdfData.text;

const chunks=text.split('\n\n').filter((chunk)=>chunk.trim()!='');

const chunkEmdeddings=[];
for (const chunk of chunks){
    const embedding= await createEmbedding(chunks[0]);
    
    chunkEmdeddings.push({
        text:chunk,
        embedding
    })
}

const points=chunkEmdeddings.map((item,index)=>({
    id:index+1,
    vector:item.embedding,
    payload:{
        text:item.text
    }
}))

await qdrant.upsert("pdf-docs",{
    points,
})

const question=req.body.question;
const questionEmbedding= await createEmbedding(question);

const searchResult= await qdrant.search('pdf-docs',{
    vector:questionEmbedding,
    limit:1
})


const bestChunk=searchResult[0].payload.text;

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: `Answer the question using the context: ${bestChunk} and Question is: ${question}`
});

res.send(response.text);

}catch(err){
 
    console.log(err);
    res.status(500).send(err);
}

})

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
