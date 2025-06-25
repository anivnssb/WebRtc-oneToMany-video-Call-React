import { useEffect, useRef, useReducer } from 'react';
import LocalVideo from './LocalVideo';
import OfferAndAnswer from './OfferAndAnswer';
import Navbar from './Navbar';
import { initialState, reducerFunction } from '../state/stateAndReducer';
import RemoteVideo from './remoteVideo';
import PinnedVideo from './PinnedVideo';
const WebRTC = ({ hostORClient, setHostORClient }) => {
  const [state, dispatch] = useReducer(reducerFunction, initialState);
  const {
    inCall,
    peerConnection,
    waitingForPeer,
    remoteStreams,
    offer,
    answer,
    pinnedClient,
    offerAnswerVisibile,
  } = state;

  const localVideoRef = useRef(null);

  useEffect(() => {
    createPeerConnection();
  }, []);

  function registerPeerConnectionListeners(peerConnection) {
    peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`
      );
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);

      switch (peerConnection.connectionState) {
        case 'connecting':
          dispatch({ type: 'SET_WAITING_FOR_PEER', payload: true });
          break;

        case 'connected':
          dispatch({ type: 'SET_IN_CALL', payload: true });
          dispatch({ type: 'SET_WAITING_FOR_PEER', payload: false });
          break;

        case 'disconnected':
          peerConnection.close();
          dispatch({ type: 'SET_IN_CALL', payload: false });
          dispatch({ type: 'SET_OFFER', payload: [] });
          dispatch({ type: 'SET_ANSWER', payload: [] });
          dispatch({ type: 'SET_REMOTE_STREAMS', payload: [] });
          createPeerConnection();
          console.log('Disconnected from peer');
          break;
      }
    });

    peerConnection.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener('iceconnectionstatechange ', () => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`
      );
    });
  }

  const createpeerConnectionForRemote = async () => {
    const pc = new RTCPeerConnection();
    registerPeerConnectionListeners(pc);

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
    dispatch({ type: 'SET_PEER_CONNECTION', payload: [...peerConnection, pc] });
    console.log('createpeerConnectionForRemote created');
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
    registerPeerConnectionListeners(pc);

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
    dispatch({ type: 'SET_PEER_CONNECTION', payload: [pc] });
  };

  const generateIceCandidate = (peerType) => {
    if (!peerConnection[peerConnection.length - 1]) {
      throw new Error('Peer connection is not available');
    }
    peerConnection[peerConnection.length - 1].onicecandidate = (event) => {
      if (event.candidate) {
        if (peerType === 'caller') {
          dispatch({
            type: 'SET_OFFER',
            payload: [
              ...offer,
              peerConnection[peerConnection.length - 1]?.localDescription,
            ],
          });
        } else if (peerType === 'receiver') {
          dispatch({
            type: 'SET_ANSWER',
            payload: [
              ...answer,
              peerConnection[peerConnection.length - 1]?.localDescription,
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

  const hangup = async () => {
    if (!peerConnection[peerConnection.length - 1]) {
      dispatch({ type: 'SET_IN_CALL', payload: false });
      dispatch({ type: 'SET_OFFER', payload: [] });
      dispatch({ type: 'SET_ANSWER', payload: [] });
      dispatch({ type: 'SET_REMOTE_STREAMS', payload: [] });

      createPeerConnection();
      throw new Error('Peer connection is not available');
    }
    for (const pc of peerConnection) {
      await pc.close();
    }
    dispatch({ type: 'SET_IN_CALL', payload: false });
    dispatch({ type: 'SET_OFFER', payload: [] });
    dispatch({ type: 'SET_ANSWER', payload: [] });
    dispatch({ type: 'SET_REMOTE_STREAMS', payload: [] });

    createPeerConnection();
  };
  const hangupRemote = async (index) => {
    if (!peerConnection[index]) {
      throw new Error('Peer connection is not available');
    }
    if (answer.length === 1) {
      hangup();
      return;
    }
    await peerConnection[index].close();
    const offerCopy = [...offer];
    offerCopy.splice(index, 1);
    dispatch({ type: 'SET_OFFER', payload: offerCopy });

    const answerCopy = [...answer];
    answerCopy.splice(index, 1);
    dispatch({ type: 'SET_ANSWER', payload: answerCopy });

    const updatedRemoteStreams = [...remoteStreams];
    updatedRemoteStreams.splice(index, 1);
    dispatch({ type: 'SET_REMOTE_STREAMS', payload: updatedRemoteStreams });

    const peerConnectionCopy = [...peerConnection];
    peerConnectionCopy.splice(index, 1);
    dispatch({ type: 'SET_PEER_CONNECTION', payload: peerConnectionCopy });
    console.log('Remote connection closed');
  };

  const startCall = async () => {
    if (!peerConnection[peerConnection.length - 1]) {
      throw new Error('Peer connection is not available');
    }

    generateIceCandidate('caller');

    const offerDescription = await peerConnection[
      peerConnection.length - 1
    ].createOffer();
    await peerConnection[peerConnection.length - 1].setLocalDescription(
      offerDescription
    );
  };

  const onAnswer = async (answer) => {
    if (!peerConnection[peerConnection.length - 1]) {
      throw new Error('Peer connection is not available');
    }

    if (peerConnection[peerConnection.length - 1].currentRemoteDescription) {
      console.log('Remote description already set');
      return;
    }

    const answerDescription = new RTCSessionDescription(answer);
    await peerConnection[peerConnection.length - 1].setRemoteDescription(
      answerDescription
    );
    dispatch({ type: 'SET_IN_CALL', payload: true });
  };

  const answerCall = async () => {
    try {
      generateIceCandidate('receiver');
      const offerr = await JSON.parse(offer[offer.length - 1]);
      const offerDescription = new RTCSessionDescription(offerr);
      await peerConnection[peerConnection.length - 1].setRemoteDescription(
        offerDescription
      );

      const answerDescription = await peerConnection[
        peerConnection.length - 1
      ].createAnswer();
      await peerConnection[peerConnection.length - 1].setLocalDescription(
        answerDescription
      );
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
          peerConnection,
          offer,
          hostORClient,
          inCall,
          dispatch,
          answer,
          createpeerConnectionForRemote,
          offerAnswerVisibile,
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
              pinnedClient ? 'pinned' : ''
            }`}
          >
            <LocalVideo
              {...{
                localVideoRef,
                inCall,
                hangup,
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
    </div>
  );
};
export default WebRTC;
