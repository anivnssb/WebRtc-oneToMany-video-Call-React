import { StrictMode } from "react";
import { createRoot, type Container } from "react-dom/client";
import App from "./App.tsx";
import type { ClientToServerEvents, ServerToClientEvents } from "./types.ts";
import { io, type Socket } from "socket.io-client";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "https://webrtc-onetomany-video-call-react.onrender.com"
);
createRoot(document.getElementById("root") as Container).render(
  <StrictMode>
    <App socket={socket} />
  </StrictMode>
);
