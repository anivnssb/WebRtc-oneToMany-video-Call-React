import "./app.css";
import { io, type Socket } from "socket.io-client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_URL as string
);
const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes socket={socket} />
    </BrowserRouter>
  );
};
export default App;
