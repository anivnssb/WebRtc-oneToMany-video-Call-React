import { StrictMode } from "react";
import { createRoot, type Container } from "react-dom/client";
import App from "./App.tsx";
import type { ClientToServerEvents, ServerToClientEvents } from "./types.ts";
import { io, type Socket } from "socket.io-client";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_URL as string
);
createRoot(document.getElementById("root") as Container).render(
  <StrictMode>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </StrictMode>
);
