import { Server, Socket } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from "../../typings"
import { instrument } from "@socket.io/admin-ui";

const app = express();
app.use(cors());
const server = createServer(app);
const port = 3000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: ["http://localhost:5173", "https://admin.socket.io/"],
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
    // this is empty broadcast to everyone, else create a room and only to that room emit the server message
    if (data.room === "") {
      io.sockets.emit("serverMsg", data);
    } else {
      socket.join(data.room)
      io.to(data.room).emit("serverMsg", data);
    }

    // Client fires an event -> server listens to that event -> we fire the event when we get it -> serves the client message to all the clients
    // io.sockets.emit("serverMsg", data); // broadcast to everyone

    // broadcast to everyone except the client
    // think sending message to another user and that other user only sees the message that you sent to them. 
    // socket.broadcast.emit("serverMsg", data)
  })
})

instrument(io, {
  auth: false,
})

server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})