import WebRTC from "../../components/WebRTC";
import Landing from "../../components/Landing";
import { useAppStateSelector } from "../../state/hook";
import type { Socket } from "socket.io-client";

const Home = ({ socket }: { socket: Socket }) => {
  const hostORClient = useAppStateSelector(
    (state) => state.appEvents.hostORClient
  );

  if (hostORClient === "") {
    return <Landing />;
  } else {
    return <WebRTC socket={socket} />;
  }
};

export default Home;
