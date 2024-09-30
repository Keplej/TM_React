import { io, Socket } from 'socket.io-client';
// Importing out typings
import { ServerToClientEvents, ClientToServerEvents } from "../../typings"
import { FormEvent, useState } from 'react';

// Able to see the socket id from server
// need to give the socket a types definition
const socket : Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")
// socket.on("connect", () => {
//   console.log(`Client: ${socket.id}`)
// })

function App() {
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("clientMsg", {msg, room}); // Need to data from the client so msg and room go here
    setMsg("");
    setRoom("")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        placeholder='Enter Task' 
        value={room} 
        onChange={e => setRoom(e.target.value)}
        />
        <input type="text" 
        placeholder='Enter Message'
        value={msg} 
        onChange={e => setMsg(e.target.value)}
        />
        <button>Send Message</button>
      </form>
    </div>
  )
}

export default App
