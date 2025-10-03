import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
import "dotenv/config";
const port: number = Number(process.env.PORT)!;
const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: process.env.CLIENT_ORIGIN,
  },
});

let meetingData: Record<string, { email: string; offer: string }> = {};

const sendHostOfferToClient = (data: { email: string; offer: string }) => {
  io.emit("offer", data);
};
const sendClientAnswerToHost = (data: { email: string; answer: string }) => {
  io.emit("answer", data);
};
const sendMeeetingDataToClient = (email: string) => {
  console.log("sending meeting data to client", meetingData);
  io.emit("sendMeetingData", meetingData[email]);
};

io.on("connection", (socket) => {
  socket.on("sendHostOffer", (data) => {
    meetingData[data.email] = { email: data.email, offer: data.offer };
    console.log("received meeting data from host", meetingData);
    sendHostOfferToClient(data);
  });
  socket.on("sendClientAnswer", (data) => {
    sendClientAnswerToHost(data);
  });
  socket.on("requestMeetingData", (data) => {
    console.log("client requesting meeting data");
    sendMeeetingDataToClient(data.email);
  });
  socket.on("clearMeetingData", () => {
    meetingData = {};
    console.log("host cleared meeting data", meetingData);
  });
});

io.listen(port);
