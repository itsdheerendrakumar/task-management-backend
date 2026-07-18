import express, {type  Response, type Request, type NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import { connectDB } from './lib/db.js';
connectDB();
import cors from 'cors';
import router from './routes/index.js';
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", router);

app.get("/health-check", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is healthy" });
})

app.use((err: {message?: string, statusCode?: number}, req: Request, res: Response, next: NextFunction) => {
    res.status(err?.statusCode || 500).json({ message: err?.message || "Internal Server Error" });
});

app.listen(3000, () => {
    console.log("server is up and running")
})