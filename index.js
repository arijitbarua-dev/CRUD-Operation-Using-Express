import { MongoClient } from 'mongodb';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

console.log("DB User: ", process.env.DB_USER)
console.log("DB User: ", process.env.DB_PASSWORD)

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zeuovx7.mongodb.net/`);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("CRUD server is running")
})

app.listen(port, () => {
    console.log(`CRUD server is running on port: ${port}`)
})