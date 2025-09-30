import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected successfully", socket.id);
  socket.on("sendHostOffer", (data) => {
    console.log(socket.id);
    console.log(data.email);
    console.log(data.offer);
  });
});

io.listen(3000);
