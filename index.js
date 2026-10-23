import { MongoClient } from 'mongodb';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dns from 'node:dns';

dns.setServers(['8.8.8.8']);

const app = express();
const port = process.env.PORT || 5000;

// console.log("DB User: ", process.env.DB_USER)
// console.log("DB User: ", process.env.DB_PASSWORD)

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zeuovx7.mongodb.net/`);

export async function connectToMongoDB() {
    try{
        await client.connect();
        console.log("Successfully connected to MongoDB");
        return client;
    }
    catch(err){
        console.dir(err)
    }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db("CRUD-DB");
const users = db.collection("users");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("CRUD server is running")
})

app.get('/users', async (req, res) => {
    const cursor = users.find({});
    const allUsers = await cursor.toArray();
    res.send(allUsers);
})

app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log("Adding new user: ", newUser);
    const result = await users.insertOne(newUser);
    res.send(result)
})

app.listen(port, () => {
    console.log(`CRUD server is running on port: ${port}`)
})