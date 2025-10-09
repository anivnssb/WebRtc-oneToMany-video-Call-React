import { useEffect, useRef, useState } from "react";
import LocalVideo from "./localVideo";
import OfferAndAnswer from "./OfferAndAnswer";
import Navbar from "./Navbar";
import RemoteVideo from "./remoteVideo";
import PinnedVideo from "./PinnedVideo";
import MeetingEnded from "./MeetingEnded";
import { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";
import { useAppDispatch, useAppStateSelector } from "../state/hook";
import {
  updateInCall,
  updateMeetingEnded,
  updateOfferAnswerVisibile,
  updatePinnedClient,
  updateWaitingForPeer,
} from "../state/appEventSlice";
import {
  updateAnswer,
  updateEmail,
  updateOffer,
  updateRemoteStreams,
} from "../state/meetingDataSlice";
interface WebRTCProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}
const WebRTC = ({ socket }: WebRTCProps) => {
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const dispatch = useAppDispatch();
  const {
    hostORClient,
    inCall,
    isMeetingEnded,
    offerAnswerVisibile,
    pinnedClient,
  } = useAppStateSelector((state) => state.appEvents);
  const { answer, email, offer } = useAppStateSelector(
    (state) => state.meetingData
  );

  const offerSentRef = useRef<boolean>(false);
  const answerSentRef = useRef<boolean>(false);
  interface ExtendedRTCPeerConnection extends RTCPeerConnection {
    pcid: number;
  }

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
        offer: offer,
        email: email,
      });
    }
  }, [offer]);
  useEffect(() => {
    if (inCall) {
      dispatch(updateOfferAnswerVisibile({ offerAnswerVisibile: false }));
    }
  }, [inCall]);
  useEffect(() => {
    if (answer && hostORClient === "client" && !answerSentRef.current) {
      answerSentRef.current = true;
      socket.emit("sendClientAnswer", {
        answer: answer,
        email: email,
      });
    }
  }, [answer]);
  useEffect(() => {
    createPeerConnection();
    socket.on("connect", () => {
      console.log("Successfully connected to Socket.IO server!");
    });
    socket.on("answer", (data) => {
      if (hostORClient === "host") {
        console.log("client answer from server", data);
        onAnswer(data.answer);
      }
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server.");
    });
  }, []);

  const resetOfferSentRef = () => (offerSentRef.current = false);

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
          dispatch(updateWaitingForPeer({ waitingForPeer: true }));
          break;

        case "connected":
          dispatch(updateInCall({ inCall: true }));
          dispatch(updateWaitingForPeer({ waitingForPeer: false }));
          break;

        case "disconnected":
          if (pcid) {
            const index = peerConnection.current.findIndex(
              (pc) => pc.pcid == pcid
            );
            if (index === -1) return;
            peeerConnection.close();

            dispatch(updateOffer({ offer: "" }));
            dispatch(updateAnswer({ answer: "" }));

            const updatedStreams = remoteStreamsRef.current
              ? [...remoteStreamsRef.current]
              : [];
            const removedStream = updatedStreams.splice(index, 1);
            setRemoteStreams(updatedStreams);
            // dispatch(updateRemoteStreams({ remoteStreams: updatedStreams }));
            if (removedStream[0].id === pinnedClientRef.current) {
              dispatch(updatePinnedClient({ pinnedClient: null }));
            }

            const updatedPeerConnections = [...peerConnection.current];
            updatedPeerConnections.splice(index, 1);
            peerConnection.current = updatedPeerConnections;

            if (updatedPeerConnections.length === 0) {
              dispatch(updateInCall({ inCall: false }));
              dispatch(updateMeetingEnded({ isMeetingEnded: true }));
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
      setRemoteStreams([...remoteStreams, remoteStream]);
      // dispatch(
      //   updateRemoteStreams({ remoteStreams: [...remoteStreams, remoteStream] })
      // );
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
      setRemoteStreams([...remoteStreams, remoteStream]);
      // dispatch(
      //   updateRemoteStreams({ remoteStreams: [...remoteStreams, remoteStream] })
      // );
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
          dispatch(
            updateOffer({
              offer: JSON.stringify(
                peerConnection.current[peerConnection.current.length - 1]
                  ?.localDescription
              ),
            })
          );
        } else if (peerType === "receiver") {
          dispatch(
            updateAnswer({
              answer: JSON.stringify(
                peerConnection.current[peerConnection.current.length - 1]
                  ?.localDescription
              ),
            })
          );
        } else {
          throw new Error(
            "Peer type is not available, please look into generating ice candidate"
          );
        }
      }
    };
  };

  const hangupHost = async (fromNavbar: boolean = false) => {
    for (const pc of peerConnection.current) {
      pc.close();
    }
    dispatch(updateInCall({ inCall: false }));
    dispatch(updateOffer({ offer: "" }));
    dispatch(updateAnswer({ answer: "" }));
    setRemoteStreams([]);
    // dispatch(updateRemoteStreams({ remoteStreams: [] }));
    dispatch(updatePinnedClient({ pinnedClient: null }));
    !fromNavbar && dispatch(updateMeetingEnded({ isMeetingEnded: true }));
    dispatch(updateEmail({ email: "" }));
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream | null;
      if (stream) {
        stream.getAudioTracks()[0].enabled = false;
        stream.getVideoTracks()[0].enabled = false;
      }
    }
    peerConnection.current = [];
    socket.emit("clearMeetingData");
  };
  const hangupClient = async (fromNavbar: boolean = false) => {
    peerConnection.current[0].close();
    dispatch(updateInCall({ inCall: false }));
    dispatch(updateOffer({ offer: "" }));
    dispatch(updateAnswer({ answer: "" }));
    setRemoteStreams([]);
    // dispatch(updateRemoteStreams({ remoteStreams: [] }));
    dispatch(updatePinnedClient({ pinnedClient: null }));
    !fromNavbar && dispatch(updateMeetingEnded({ isMeetingEnded: true }));
    dispatch(updateEmail({ email: "" }));
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream | null;
      if (stream) {
        stream.getAudioTracks()[0].enabled = false;
        stream.getVideoTracks()[0].enabled = false;
      }
    }
    peerConnection.current = [];
  };
  const hangupRemote = async (index: number) => {
    if (!peerConnection.current[index]) {
      throw new Error("Peer connection is not available");
    }
    if (peerConnection.current.length === 1) {
      hangupHost();
      return;
    }
    peerConnection.current[index].close();
    dispatch(updateOffer({ offer: "" }));
    dispatch(updateAnswer({ answer: "" }));

    const updatedRemoteStreams = [...remoteStreams];
    const removedStream = updatedRemoteStreams.splice(index, 1);
    setRemoteStreams(updatedRemoteStreams);
    // dispatch(updateRemoteStreams({ remoteStreams: updatedRemoteStreams }));
    if (removedStream[0].id === pinnedClient) {
      dispatch(updatePinnedClient({ pinnedClient: null }));
    }

    const peerConnectionCopy = [...peerConnection.current];
    peerConnectionCopy.splice(index, 1);
    peerConnection.current = peerConnectionCopy;
    console.log("peer connection for Remote closed");
  };

  const startCall = async () => {
    resetOfferSentRef();
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
  };

  const onAnswer = async (answer: string) => {
    try {
      const answerr: { sdp: string; type: RTCSdpType } = await JSON.parse(
        answer
      );
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
      dispatch(updateInCall({ inCall: true }));
      dispatch(updateOfferAnswerVisibile({ offerAnswerVisibile: false }));
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
          hostORClient,
          inCall,
          createNewPeerConnectionForRemote,
          offerAnswerVisibile,
          hangup: hostORClient === "host" ? hangupHost : hangupClient,
          resetOfferSentRef,
        }}
      />

      <div className="call-section">
        <OfferAndAnswer
          {...{
            hostORClient,
            startCall,
            answerCall,
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
      {isMeetingEnded ? <MeetingEnded /> : ""}
    </div>
  );
};
export default WebRTC;
