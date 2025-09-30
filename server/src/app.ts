import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173", // Allow your React app's origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected successfully");
});

io.listen(3000);
