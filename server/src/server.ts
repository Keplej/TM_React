import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
const server = createServer(app);
const port = 3000;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// app.get('/', (req: Request, res: Response) => {
//     res.send('<h1>Hello World</h1>');
// });

io.on("connection", (socket) => {
    console.log(socket.id);
})

server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})