import { MongoClient, ObjectId } from 'mongodb';
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

app.get('/users/:id', async (req, res) => {
    console.log("Params in the server", req.params);
    const id = req.params.id;

    const query = {_id: new ObjectId(id)};
    const result = await users.findOne(query);
    res.send(result);
})

app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log("Adding new user: ", newUser);
    const result = await users.insertOne(newUser);
    res.send(result);
})

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await users.deleteOne(query);
    res.send(result);
})

// update
app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    console.log("Updated user: ", updatedUser, "and ID: ", id);
    const filter = {_id: new ObjectId(id)};
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            name: updatedUser.name,
            email: updatedUser.email
        }
    }
    const result = await users.updateOne(filter, updateDoc, options);
})

app.listen(port, () => {
    console.log(`CRUD server is running on port: ${port}`)
})