import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectToDatabase from './db/connection.js';
import dotenv from 'dotenv';
import router from './db/routes.js';
dotenv.config();

const PORT=process.env.PORT;
const DATABASE_URL=process.env.DATABASE_URL;


const app=express();
app.use(express.json());
app.use(cors());


connectToDatabase(DATABASE_URL); //connecting to database url....

app.use('/api/users',router);
app.use('/api/blog', router);


app.listen(PORT, ()=>{
    console.log(`Server is working at http://localhost:${PORT}/`)
})