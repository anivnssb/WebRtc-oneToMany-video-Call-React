import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
import "dotenv/config";
const port: number = Number(process.env.PORT)!;
const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: process.env.CLIENT_ORIGIN,
  },
});

const sendHostOfferToClient = (data: { room: string; offer: string }) => {
  io.emit("offer", data);
};
const sendClientAnswerToHost = (data: { room: string; answer: string }) => {
  io.emit("answer", data);
};

io.on("connection", (socket) => {
  socket.on("sendHostOffer", (data) => {
    sendHostOfferToClient(data);
  });
  socket.on("sendClientAnswer", (data) => {
    sendClientAnswerToHost(data);
  });
});

io.listen(port);
