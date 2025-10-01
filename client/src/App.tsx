import { useState } from "react";
import WebRTC from "./components/WebRTC";
import Landing from "./components/Landing";
import "./app.css";
import { type Socket } from "socket.io-client";
const App = ({ socket }: { socket: Socket }) => {
  const [hostORClient, setHostORClient] = useState("");
  if (hostORClient === "") {
    return (
      <Landing hostORClient={hostORClient} setHostORClient={setHostORClient} />
    );
  } else {
    return (
      <WebRTC
        hostORClient={hostORClient}
        setHostORClient={setHostORClient}
        socket={socket}
      />
    );
  }
};

export default App;
