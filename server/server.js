import { Server } from "socket.io";
const io = new Server({
/* options */
});
io.on("connection", (socket) => {
    console.log("connected successfully");
});
io.listen(3000);
