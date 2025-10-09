import WebRTC from "./components/WebRTC";
import Landing from "./components/Landing";
import "./app.css";
import { type Socket } from "socket.io-client";
import { useAppStateSelector } from "./state/hook";
const App = ({ socket }: { socket: Socket }) => {
  const hostORClient = useAppStateSelector(
    (state) => state.appEvents.hostORClient
  );

  if (hostORClient === "") {
    return <Landing />;
  } else {
    return <WebRTC socket={socket} />;
  }
};

export default App;
