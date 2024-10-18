import "dotenv/config";
import { Server, Socket } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from "../../typings"
import { instrument } from "@socket.io/admin-ui";
import mongoose from "mongoose";
import { router as userRouter } from "./routes/user.router";
import connectToMongoDb from "./config/db.config";
import { PORT, NODE_ENV } from "./constants/env";
import errorHandler from "./middleware/error-handler.middleware";

const app = express();
app.use(cors({
    // origin: APP_ORIGIN,
    // credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const server = createServer(app);


const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: ["http://localhost:5173", "https://admin.socket.io/"],
        methods: ["GET", "POST"],
        credentials: true,
    },
})

app.use('/api', userRouter);

app.get("/", async (req, res, next) => {
    try {
        throw new Error("This is an test Error");
        res.status(200).json({
            status: "healthy",
        });
    } catch(e) {
        next(e);
    }
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`App is listening on port ${PORT} in ${NODE_ENV} environment.`)
  await connectToMongoDb();
})