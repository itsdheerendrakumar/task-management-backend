import express, {type  Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
app.use(cors());

app.get("/health-check", (req, res: Response) => {
    res.status(200).json({ message: "Server is healthy" });
})
app.listen(3000, () => {
    console.log("server is up and running")
})