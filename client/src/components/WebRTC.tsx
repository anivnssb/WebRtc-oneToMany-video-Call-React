import { useEffect, useRef, useReducer, useCallback } from "react";
import LocalVideo from "./localVideo";
import OfferAndAnswer from "./OfferAndAnswer";
import Navbar from "./Navbar";
import { initialState, reducerFunction } from "../state/stateAndReducer";
import RemoteVideo from "./remoteVideo";
import PinnedVideo from "./PinnedVideo";
import MeetingEnded from "./MeetingEnded";
import { Socket } from "socket.io-client";
interface WebRTCProps {
  setHostORClient: React.Dispatch<React.SetStateAction<string>>;
  hostORClient: string;
  socket: Socket;
}
const WebRTC = ({ hostORClient, setHostORClient, socket }: WebRTCProps) => {
  const offerSentRef = useRef<boolean>(false);
  const answerSentRef = useRef<boolean>(false);
  interface ExtendedRTCPeerConnection extends RTCPeerConnection {
    pcid: number;
  }
  const [state, dispatch] = useReducer(reducerFunction, initialState);
  const {
    inCall,
    waitingForPeer,
    remoteStreams,
    offer,
    answer,
    pinnedClient,
    offerAnswerVisibile,
    isMeetingEnded,
    email,
  } = state;
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<ExtendedRTCPeerConnection[]>([]);
  const remoteStreamsRef = useRef<MediaStream[] | null>(null);
  const pinnedClientRef = useRef<string>(null);

  useEffect(() => {
    remoteStreamsRef.current = remoteStreams.concat([]);
  }, [remoteStreams]);
  useEffect(() => {
    pinnedClientRef.current = pinnedClient;
  }, [pinnedClient]);
  useEffect(() => {
    if (offer && hostORClient === "host" && !offerSentRef.current) {
      offerSentRef.current = true;
      socket.emit("sendHostOffer", {
        offer: JSON.stringify(offer),
        email: email,
      });
      console.log("sending offer");
    }
  }, [offer]);
  useEffect(() => {
    if (answer && hostORClient === "client" && !answerSentRef.current) {
      answerSentRef.current = true;
      socket.emit("sendClientAnswer", {
        answer: JSON.stringify(answer),
        email: email,
      });
      console.log("sending answer");
    }
  }, [answer]);
  useEffect(() => {
    createPeerConnection();
    socket.on("connect", () => {
      console.log("Successfully connected to Socket.IO server!");
    });

    socket.on("offer", (data) => {
      hostORClient === "client" && answerCall(data.offer);
    });

    socket.on("answer", (data) => {
      if (hostORClient === "host") {
        console.log("answer received", data.answer);
        onAnswer(data.answer);
      }
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server.");
    });
  }, []);

  function registerPeerConnectionListeners(
    peeerConnection: RTCPeerConnection,
    pcid: number
  ) {
    peeerConnection.addEventListener("icegatheringstatechange", () => {
      console.log(
        `ICE gathering state changed: ${peeerConnection.iceGatheringState}`
      );
    });

    peeerConnection.addEventListener("connectionstatechange", () => {
      console.log(
        `Connection state change: ${peeerConnection.connectionState}`
      );

      switch (peeerConnection.connectionState) {
        case "connecting":
          dispatch({ type: "SET_WAITING_FOR_PEER", payload: true });
          break;

        case "connected":
          dispatch({ type: "SET_IN_CALL", payload: true });
          dispatch({ type: "SET_WAITING_FOR_PEER", payload: false });
          break;

        case "disconnected":
          if (pcid) {
            const index = peerConnection.current.findIndex(
              (pc) => pc.pcid == pcid
            );
            if (index === -1) return;
            peeerConnection.close();

            dispatch({ type: "SET_OFFER", payload: "" });

            dispatch({ type: "SET_ANSWER", payload: "" });

            const updatedStreams = remoteStreamsRef.current
              ? [...remoteStreamsRef.current]
              : [];
            const removedStream = updatedStreams.splice(index, 1);
            dispatch({ type: "SET_REMOTE_STREAMS", payload: updatedStreams });
            if (removedStream[0].id === pinnedClientRef.current) {
              dispatch({ type: "SET_PINNED_CLIENT", payload: null });
            }

            const updatedPeerConnections = [...peerConnection.current];
            updatedPeerConnections.splice(index, 1);
            peerConnection.current = updatedPeerConnections;

            if (updatedPeerConnections.length === 0) {
              dispatch({ type: "SET_IN_CALL", payload: false });
              dispatch({ type: "SET_IS_MEETING_ENDED", payload: true });
              if (localVideoRef.current) {
                const stream = localVideoRef.current
                  .srcObject as MediaStream | null;
                if (stream) {
                  stream.getAudioTracks()[0].enabled = false;
                  stream.getVideoTracks()[0].enabled = false;
                }
              }
            }
            console.log("Disconnected from peer");
            break;
          }
      }
    });

    peeerConnection.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${peeerConnection.signalingState}`);
    });

    peeerConnection.addEventListener("iceconnectionstatechange ", () => {
      console.log(
        `ICE connection state change: ${peeerConnection.iceConnectionState}`
      );
    });
  }

  const createNewPeerConnectionForRemote = async (): Promise<void> => {
    const pc = new RTCPeerConnection() as ExtendedRTCPeerConnection;
    registerPeerConnectionListeners(
      pc,
      peerConnection.current[peerConnection.current.length - 1].pcid + 1
    );
    const localStream = localVideoRef.current?.srcObject as MediaStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    } else {
      throw new Error(
        "Local stream is not available, please check your camera and microphone"
      );
    }
    pc.ontrack = async (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      dispatch({
        type: "SET_REMOTE_STREAMS",
        payload: [...remoteStreams, remoteStream],
      });
    };
    pc.pcid =
      peerConnection.current[peerConnection.current.length - 1].pcid + 1;
    peerConnection.current = [...peerConnection.current, pc];

    console.log("New Peer Connection ForRemote created");
  };
  const createPeerConnection = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.getAudioTracks()[0].enabled = false;
    localStream.getVideoTracks()[0].enabled = false;
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    const pc = new RTCPeerConnection() as ExtendedRTCPeerConnection;
    registerPeerConnectionListeners(pc, 1);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    } else {
      throw new Error(
        "Local stream is not available, please check your camera and microphone"
      );
    }
    pc.ontrack = async (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      dispatch({
        type: "SET_REMOTE_STREAMS",
        payload: [...remoteStreams, remoteStream],
      });
    };
    pc.pcid = 1;
    peerConnection.current = [pc];
  };

  const generateIceCandidate = (peerType: string) => {
    if (!peerConnection.current[peerConnection.current.length - 1]) {
      throw new Error("Peer connection is not available");
    }
    peerConnection.current[peerConnection.current.length - 1].onicecandidate = (
      event
    ) => {
      if (event.candidate) {
        if (peerType === "caller") {
          dispatch({
            type: "SET_OFFER",
            payload:
              peerConnection.current[peerConnection.current.length - 1]
                ?.localDescription,
          });
        } else if (peerType === "receiver") {
          dispatch({
            type: "SET_ANSWER",
            payload:
              peerConnection.current[peerConnection.current.length - 1]
                ?.localDescription,
          });
        } else {
          throw new Error(
            "Peer type is not available, please look into generating ice candidate"
          );
        }
      }
    };
  };

  const hangupHost = useCallback(async () => {
    for (const pc of peerConnection.current) {
      pc.close();
    }
    dispatch({ type: "SET_IN_CALL", payload: false });
    dispatch({ type: "SET_OFFER", payload: "" });
    dispatch({ type: "SET_ANSWER", payload: "" });
    dispatch({ type: "SET_REMOTE_STREAMS", payload: [] });
    dispatch({ type: "SET_PINNED_CLIENT", payload: null });
    dispatch({ type: "SET_IS_MEETING_ENDED", payload: true });
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream | null;
      if (stream) {
        stream.getAudioTracks()[0].enabled = false;
        stream.getVideoTracks()[0].enabled = false;
      }
    }
    peerConnection.current = [];
  }, []);
  const hangupClient = useCallback(async () => {
    peerConnection.current[0].close();
    dispatch({ type: "SET_IN_CALL", payload: false });
    dispatch({ type: "SET_OFFER", payload: "" });
    dispatch({ type: "SET_ANSWER", payload: "" });
    dispatch({ type: "SET_REMOTE_STREAMS", payload: [] });
    dispatch({ type: "SET_PINNED_CLIENT", payload: null });
    dispatch({ type: "SET_IS_MEETING_ENDED", payload: true });
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream | null;
      if (stream) {
        stream.getAudioTracks()[0].enabled = false;
        stream.getVideoTracks()[0].enabled = false;
      }
    }
    peerConnection.current = [];
  }, []);
  const hangupRemote = useCallback(async (index: number) => {
    if (!peerConnection.current[index]) {
      throw new Error("Peer connection is not available");
    }
    if (peerConnection.current.length === 1) {
      hangupHost();
      return;
    }
    peerConnection.current[index].close();
    const offerCopy = [...offer];
    offerCopy.splice(index, 1);
    dispatch({ type: "SET_OFFER", payload: offerCopy });

    const answerCopy = [...answer];
    answerCopy.splice(index, 1);
    dispatch({ type: "SET_ANSWER", payload: answerCopy });

    const updatedRemoteStreams = [...remoteStreams];
    const removedStream = updatedRemoteStreams.splice(index, 1);
    dispatch({ type: "SET_REMOTE_STREAMS", payload: updatedRemoteStreams });
    if (removedStream[0].id === pinnedClient) {
      dispatch({ type: "SET_PINNED_CLIENT", payload: null });
    }

    const peerConnectionCopy = [...peerConnection.current];
    peerConnectionCopy.splice(index, 1);
    peerConnection.current = peerConnectionCopy;
    console.log("peer connection for Remote closed");
  }, []);

  const startCall = useCallback(async () => {
    offerSentRef.current = false;
    if (!peerConnection.current[peerConnection.current.length - 1]) {
      throw new Error("Peer connection is not available");
    }

    generateIceCandidate("caller");

    const offerDescription = await peerConnection.current[
      peerConnection.current.length - 1
    ].createOffer();
    await peerConnection.current[
      peerConnection.current.length - 1
    ].setLocalDescription(offerDescription);
  }, []);

  const onAnswer = async (answer: string) => {
    try {
      console.log(answer);
      const answerr: { sdp: string; type: RTCSdpType } = await JSON.parse(
        answer
      );
      console.log(answerr);
      if (!peerConnection.current[peerConnection.current.length - 1]) {
        throw new Error("Peer connection is not available");
      }

      if (
        peerConnection.current[peerConnection.current.length - 1]
          .currentRemoteDescription
      ) {
        console.log("Remote description already set");
        return;
      }
      const answerDescription = new RTCSessionDescription(answerr);
      await peerConnection.current[
        peerConnection.current.length - 1
      ].setRemoteDescription(answerDescription);
      dispatch({ type: "SET_IN_CALL", payload: true });
    } catch (error) {
      console.log(error);
    }
  };

  const answerCall = async (offer: string) => {
    try {
      generateIceCandidate("receiver");
      const offerr = await JSON.parse(offer);
      const offerDescription = new RTCSessionDescription(offerr);
      await peerConnection.current[
        peerConnection.current.length - 1
      ].setRemoteDescription(offerDescription);

      const answerDescription = await peerConnection.current[
        peerConnection.current.length - 1
      ].createAnswer();
      await peerConnection.current[
        peerConnection.current.length - 1
      ].setLocalDescription(answerDescription);
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };
  return (
    <div className="App">
      <Navbar
        {...{
          setHostORClient,
          waitingForPeer,
          peerConnection: peerConnection.current,
          offer,
          hostORClient,
          inCall,
          dispatch,
          answer,
          createNewPeerConnectionForRemote,
          offerAnswerVisibile,
          hangup: hostORClient === "host" ? hangupHost : hangupClient,
        }}
      />

      <div className="call-section">
        <OfferAndAnswer
          {...{
            hostORClient,
            startCall,
            answerCall,
            onAnswer,
            offer,
            answer,
            dispatch,
            offerAnswerVisibile,
            socket,
          }}
        />
        <div className="pinned-state">
          <div
            className={`local-remote-video-wraper ${
              inCall ? "connected" : "notConnected"
            } ${pinnedClient ? "pinned" : ""}`}
          >
            <LocalVideo
              {...{
                inCall,
                hangup: hostORClient === "host" ? hangupHost : hangupClient,
                pinnedClient,
              }}
              ref={localVideoRef}
              key="localvdo-123"
            />
            {remoteStreams.length
              ? remoteStreams.map((stream: MediaStream, index: number) => {
                  if (pinnedClient !== stream.id) {
                    return (
                      <RemoteVideo
                        {...{
                          stream,
                          index,
                          hangupRemote,
                          hostORClient,
                          dispatch,
                          pinnedClient,
                          inCall,
                          remoteStreams,
                        }}
                        key={index + "remote-video-component"}
                      />
                    );
                  }
                })
              : ""}
          </div>
          {pinnedClient ? (
            <div className="pinned-section">
              <PinnedVideo
                {...{
                  pinnedClient,
                  hangupRemote,
                  dispatch,
                  hostORClient,
                  remoteStreams,
                  stream:
                    remoteStreams[
                      remoteStreams.findIndex(
                        ({ id }: { id: string }) => id === pinnedClient
                      )
                    ],
                  index: remoteStreams.findIndex(
                    ({ id }: { id: string }) => id === pinnedClient
                  ),
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {isMeetingEnded ? <MeetingEnded {...{ setHostORClient }} /> : ""}
    </div>
  );
};
export default WebRTC;
