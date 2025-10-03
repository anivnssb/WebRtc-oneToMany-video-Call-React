import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
import "dotenv/config";

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: "https://web-rtc-one-to-many-video-call-reac.vercel.app",
  },
});

const sendHostOfferToClient = (data: { email: string; offer: string }) => {
  console.log("sending offer");
  io.emit("offer", data);
};
const sendClientAnswerToHost = (data: { email: string; answer: string }) => {
  console.log("sending answer");
  io.emit("answer", data);
};

io.on("connection", (socket) => {
  console.log("connected successfully", socket.id);
  socket.on("sendHostOffer", (data) => {
    console.log("receving offer");
    sendHostOfferToClient(data);
  });
  socket.on("sendClientAnswer", (data) => {
    console.log("receving answer", data);
    sendClientAnswerToHost(data);
  });
});

io.listen(3000);
