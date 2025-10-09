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

const sendClientAnswerToHost = (data: { email: string; answer: string }) => {
  console.log("sending clients answer to host", data.email);
  io.emit("answer", data);
};
const sendMeeetingDataToClient = (email: string) => {
  console.log("sending meeting data to client", email);
  io.emit("sendMeetingData", meetingData[email]);
};

io.on("connection", (socket) => {
  socket.on("sendHostOffer", (data) => {
    meetingData[data.email] = { email: data.email, offer: data.offer };
    console.log("received meeting data from host", data.email);
  });
  socket.on("sendClientAnswer", (data) => {
    console.log("client answer received", data.email);
    sendClientAnswerToHost(data);
  });
  socket.on("requestMeetingData", (data) => {
    console.log("client requesting meeting data", data.email);
    sendMeeetingDataToClient(data.email);
  });
  socket.on("clearMeetingData", () => {
    meetingData = {};
    console.log("host cleared meeting data", meetingData);
  });
});

io.listen(port);
