import { Server, Socket } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from "../../typings"

const app = express();
app.use(cors());
const server = createServer(app);
const port = 3000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// app.get('/', (req: Request, res: Response) => {
//     res.send('<h1>Hello World</h1>');
// });

io.on("connection", (socket : Socket<ClientToServerEvents, ServerToClientEvents>) => { // types are reversed from the client 
    // console.log(socket.id);
  socket.on("clientMsg", (data) => { // call back function data
    console.log(data);
  })
})

server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})