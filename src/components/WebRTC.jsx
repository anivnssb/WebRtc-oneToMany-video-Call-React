import { useEffect, useRef, useReducer } from 'react';
import LocalVideo from './LocalVideo';
import OfferAndAnswer from './OfferAndAnswer';
import Navbar from './Navbar';
import { initialState, reducerFunction } from '../state/stateAndReducer';
import RemoteVideo from './remoteVideo';
import PinnedVideo from './PinnedVideo';
import MeetingEnded from './MeetingEnded';
const WebRTC = ({ hostORClient, setHostORClient }) => {
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
  } = state;

  const localVideoRef = useRef(null);
  const peerConnection = useRef([]);
  const remoteStreamsRef = useRef();
  const answerRef = useRef([]);
  const offerRef = useRef([]);
  const pinnedClientRef = useRef(null);

  useEffect(() => {
    remoteStreamsRef.current = remoteStreams.concat([]);
  }, [remoteStreams]);
  useEffect(() => {
    answerRef.current = answer.concat([]);
  }, [answer]);
  useEffect(() => {
    offerRef.current = offer.concat([]);
  }, [offer]);
  useEffect(() => {
    pinnedClientRef.current = pinnedClient;
  }, [pinnedClient]);

  useEffect(() => {
    createPeerConnection();
  }, []);

  function registerPeerConnectionListeners(peeerConnection, pcid) {
    peeerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(
        `ICE gathering state changed: ${peeerConnection.iceGatheringState}`
      );
    });

    peeerConnection.addEventListener('connectionstatechange', () => {
      console.log(
        `Connection state change: ${peeerConnection.connectionState}`
      );

      switch (peeerConnection.connectionState) {
        case 'connecting':
          dispatch({ type: 'SET_WAITING_FOR_PEER', payload: true });
          break;

        case 'connected':
          dispatch({ type: 'SET_IN_CALL', payload: true });
          dispatch({ type: 'SET_WAITING_FOR_PEER', payload: false });
          break;

        case 'disconnected':
          if (pcid) {
            const index = peerConnection.current.findIndex(
              (pc) => pc.pcid == pcid
            );
            if (index === -1) return;
            peeerConnection.close();
            const updatedOffers = [...offerRef.current];
            updatedOffers.splice(index, 1);
            dispatch({ type: 'SET_OFFER', payload: updatedOffers });

            const updatedAnswers = [...answerRef.current];
            updatedAnswers.splice(index, 1);
            dispatch({ type: 'SET_ANSWER', payload: updatedAnswers });

            const updatedStreams = [...remoteStreamsRef.current];
            const removedStream = updatedStreams.splice(index, 1);
            dispatch({ type: 'SET_REMOTE_STREAMS', payload: updatedStreams });
            if (removedStream[0].id === pinnedClientRef.current) {
              dispatch({ type: 'SET_PINNED_CLIENT', payload: null });
            }

            const updatedPeerConnections = [...peerConnection.current];
            updatedPeerConnections.splice(index, 1);
            peerConnection.current = updatedPeerConnections;

            if (updatedPeerConnections.length === 0) {
              dispatch({ type: 'SET_IN_CALL', payload: false });
              dispatch({ type: 'SET_IS_MEETING_ENDED', payload: true });
              localVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
              localVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
            }
            console.log('Disconnected from peer');
            break;
          }
      }
    });

    peeerConnection.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peeerConnection.signalingState}`);
    });

    peeerConnection.addEventListener('iceconnectionstatechange ', () => {
      console.log(
        `ICE connection state change: ${peeerConnection.iceConnectionState}`
      );
    });
  }

  const createNewPeerConnectionForRemote = async () => {
    const pc = new RTCPeerConnection();
    registerPeerConnectionListeners(
      pc,
      peerConnection.current[peerConnection.current.length - 1].pcid + 1
    );
    const localStream = localVideoRef.current?.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    } else {
      throw new Error(
        'Local stream is not available, please check your camera and microphone'
      );
    }
    pc.ontrack = async (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      dispatch({
        type: 'SET_REMOTE_STREAMS',
        payload: [...remoteStreams, remoteStream],
      });
    };
    pc.pcid =
      peerConnection.current[peerConnection.current.length - 1].pcid + 1;
    peerConnection.current = [...peerConnection.current, pc];

    console.log('New Peer Connection ForRemote created');
  };
  const createPeerConnection = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.getAudioTracks()[0].enabled = false;
    localStream.getVideoTracks()[0].enabled = false;
    localVideoRef.current.srcObject = localStream;
    const pc = new RTCPeerConnection();
    registerPeerConnectionListeners(pc, 1);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    } else {
      throw new Error(
        'Local stream is not available, please check your camera and microphone'
      );
    }
    pc.ontrack = async (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      dispatch({
        type: 'SET_REMOTE_STREAMS',
        payload: [...remoteStreams, remoteStream],
      });
    };
    pc.pcid = 1;
    peerConnection.current = [pc];
  };

  const generateIceCandidate = (peerType) => {
    if (!peerConnection.current[peerConnection.current.length - 1]) {
      throw new Error('Peer connection is not available');
    }
    peerConnection.current[peerConnection.current.length - 1].onicecandidate = (
      event
    ) => {
      if (event.candidate) {
        if (peerType === 'caller') {
          dispatch({
            type: 'SET_OFFER',
            payload: [
              ...offer,
              peerConnection.current[peerConnection.current.length - 1]
                ?.localDescription,
            ],
          });
        } else if (peerType === 'receiver') {
          dispatch({
            type: 'SET_ANSWER',
            payload: [
              ...answer,
              peerConnection.current[peerConnection.current.length - 1]
                ?.localDescription,
            ],
          });
        } else {
          throw new Error(
            'Peer type is not available, please look into generating ice candidate'
          );
        }
      }
    };
  };

  const hangupHost = async () => {
    for (const pc of peerConnection.current) {
      await pc.close();
    }
    dispatch({ type: 'SET_IN_CALL', payload: false });
    dispatch({ type: 'SET_OFFER', payload: [] });
    dispatch({ type: 'SET_ANSWER', payload: [] });
    dispatch({ type: 'SET_REMOTE_STREAMS', payload: [] });
    dispatch({ type: 'SET_PINNED_CLIENT', payload: null });
    dispatch({ type: 'SET_IS_MEETING_ENDED', payload: true });
    localVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
    localVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
    peerConnection.current = [];
  };
  const hangupClient = async () => {
    await peerConnection.current[0].close();
    dispatch({ type: 'SET_IN_CALL', payload: false });
    dispatch({ type: 'SET_OFFER', payload: [] });
    dispatch({ type: 'SET_ANSWER', payload: [] });
    dispatch({ type: 'SET_REMOTE_STREAMS', payload: [] });
    dispatch({ type: 'SET_PINNED_CLIENT', payload: null });
    dispatch({ type: 'SET_IS_MEETING_ENDED', payload: true });
    localVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
    localVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
    peerConnection.current = [];
  };
  const hangupRemote = async (index) => {
    if (!peerConnection.current[index]) {
      throw new Error('Peer connection is not available');
    }
    if (peerConnection.current.length === 1) {
      hangupHost();
      return;
    }
    await peerConnection.current[index].close();
    const offerCopy = [...offer];
    offerCopy.splice(index, 1);
    dispatch({ type: 'SET_OFFER', payload: offerCopy });

    const answerCopy = [...answer];
    answerCopy.splice(index, 1);
    dispatch({ type: 'SET_ANSWER', payload: answerCopy });

    const updatedRemoteStreams = [...remoteStreams];
    const removedStream = updatedRemoteStreams.splice(index, 1);
    dispatch({ type: 'SET_REMOTE_STREAMS', payload: updatedRemoteStreams });
    if (removedStream[0].id === pinnedClient) {
      dispatch({ type: 'SET_PINNED_CLIENT', payload: null });
    }

    const peerConnectionCopy = [...peerConnection.current];
    peerConnectionCopy.splice(index, 1);
    peerConnection.current = peerConnectionCopy;
    console.log('peer connection for Remote closed');
  };

  const startCall = async () => {
    if (!peerConnection.current[peerConnection.current.length - 1]) {
      throw new Error('Peer connection is not available');
    }

    generateIceCandidate('caller');

    const offerDescription = await peerConnection.current[
      peerConnection.current.length - 1
    ].createOffer();
    await peerConnection.current[
      peerConnection.current.length - 1
    ].setLocalDescription(offerDescription);
  };

  const onAnswer = async (answer) => {
    if (!peerConnection.current[peerConnection.current.length - 1]) {
      throw new Error('Peer connection is not available');
    }

    if (
      peerConnection.current[peerConnection.current.length - 1]
        .currentRemoteDescription
    ) {
      console.log('Remote description already set');
      return;
    }

    const answerDescription = new RTCSessionDescription(answer);
    await peerConnection.current[
      peerConnection.current.length - 1
    ].setRemoteDescription(answerDescription);
    dispatch({ type: 'SET_IN_CALL', payload: true });
  };

  const answerCall = async () => {
    try {
      generateIceCandidate('receiver');
      const offerr = await JSON.parse(offer[offer.length - 1]);
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
      console.error('Error answering call:', error);
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
          hangup: hostORClient === 'host' ? hangupHost : hangupClient,
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
          }}
        />
        <div className="pinned-state">
          <div
            className={`local-remote-video-wraper ${
              inCall ? 'connected' : 'notConnected'
            } ${pinnedClient ? 'pinned' : ''}`}
          >
            <LocalVideo
              {...{
                localVideoRef,
                inCall,
                hangup: hostORClient === 'host' ? hangupHost : hangupClient,
                pinnedClient,
              }}
              key="localvdo-123"
            />
            {remoteStreams.length
              ? remoteStreams.map((stream, index) => {
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
                        key={index + 'remote-video-component'}
                      />
                    );
                  }
                })
              : ''}
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
                      remoteStreams.findIndex(({ id }) => id === pinnedClient)
                    ],
                  index: remoteStreams.findIndex(
                    ({ id }) => id === pinnedClient
                  ),
                }}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {isMeetingEnded ? <MeetingEnded {...{ setHostORClient }} /> : ''}
    </div>
  );
};
export default WebRTC;
