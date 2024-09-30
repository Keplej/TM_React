import { io, Socket } from 'socket.io-client';
// Importing out typings
import { ServerToClientEvents, ClientToServerEvents } from "../../typings"

// Able to see the socket id from server
// need to give the socket a types definition
const socket : Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")
// socket.on("connect", () => {
//   console.log(`Client: ${socket.id}`)
// })

function App() {

  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

export default App
