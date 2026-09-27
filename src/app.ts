import express, {type  Response, type Request, type NextFunction } from 'express';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from  "socket.io";
import cookieParser from 'cookie-parser';
dotenv.config();
import { connectDB } from './lib/db.js';
connectDB();
import cors from 'cors';
import router from './routes/index.js';
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinRoom", (chatId) => {
    console.log("joining room", chatId);
    socket.join(chatId);
  })

  socket.on("message", (data) => {
    const chatId = data.chatId;
    console.log("message received", data);
    socket.to(chatId).emit("message", data);
  });
});

app.set('trust proxy', 1);

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

httpServer.listen(3000, () => {
    console.log("server is up and running")
})