import express from "express";
import { Server } from "socket.io";
import http from "http";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
import "dotenv/config";
import { connectDB } from "./utils/features.js";

const socketPort: number = Number(process.env.SOCKET_PORT)!;
const port: number = Number(process.env.PORT)!;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);

const app = express();

app.get("/", (req, res) =>
  res.send({ message: "api is working with /api/v1" })
);

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
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

io.listen(socketPort);

app.listen(port, () => {
  console.log(`server is working on localhost:${port}`);
});
