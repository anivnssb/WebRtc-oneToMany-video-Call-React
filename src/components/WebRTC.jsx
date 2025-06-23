import { useEffect, useState, useRef, useReducer } from 'react';
import RemotVideo from './remoteVideo';
import LocalVideo from './LocalVideo';
import OfferAndAnswer from './OfferAndAnswer';
import Landing from './Landing';
import Navbar from './Navbar';
import { initialState, reducerFunction } from '../state/stateAndReducer';
import RemoteVideo from './remoteVideo';
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
  } = state;

  const localVideoRef = useRef(null);

  useEffect(() => {
    createPeerConnection();
  }, []);

  function registerPeerConnectionListeners(peerConnection) {
    // Register event listeners for the peer connection
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
    // This function is used to create a new peer connection for new remote video streams
    const pc = new RTCPeerConnection();
    registerPeerConnectionListeners(pc);

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
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
  };
  const createPeerConnection = async () => {
    // This function is used to create a new peer connection for the firt time
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    //  Update video streams in the DOM
    localVideoRef.current.srcObject = localStream;

    //	create peer connection
    const pc = new RTCPeerConnection();
    registerPeerConnectionListeners(pc);

    //  Push tracks from local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    } else {
      throw new Error(
        'Local stream is not available, please check your camera and microphone'
      );
    }

    //  Pull tracks from remote stream, add to video stream in DOM
    // if (remoteStream) {
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

  const generateIceCandidate = async (peerType) => {
    if (!peerConnection[peerConnection.length - 1]) {
      throw new Error('Peer connection is not available');
    }
    peerConnection[peerConnection.length - 1].onicecandidate = (event) => {
      if (event.candidate) {
        //  when ice candidate is received, we'll update the offer and answer sdp and then send it back to the caller and callee
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
    // end the meeting for all clients
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
    //end call with client
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
    //********for host only********
    if (!peerConnection[peerConnection.length - 1]) {
      throw new Error('Peer connection is not available');
    }

    await generateIceCandidate('caller');

    const offerDescription = await peerConnection[
      peerConnection.length - 1
    ].createOffer();
    await peerConnection[peerConnection.length - 1].setLocalDescription(
      offerDescription
    );

    const offerr = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    dispatch({ type: 'SET_OFFER', payload: [...offerr, offerr] });
  };

  const onAnswer = async (answer) => {
    //********for host only********
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
    //********for client only********

    try {
      await generateIceCandidate('receiver');
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

      const answerr = {
        sdp: answerDescription.sdp,
        type: answerDescription.type,
      };
      dispatch({ type: 'SET_ANSWER', payload: [...answer, answerr] });
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };
  if (!hostORClient) {
    return <></>;
  }
  return (
    <div className="App">
      <Navbar
        {...{
          setHostORClient,
          waitingForPeer,
          peerConnection,
          hostORClient,
          inCall,
          dispatch,
          answer,
          createpeerConnectionForRemote,
          hangup,
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
          }}
        />
        <div className="local-remote-video-wraper">
          <LocalVideo
            {...{
              localVideoRef,
              inCall,
              hangup,
              pinnedClient,
            }}
          />
          {remoteStreams.length
            ? remoteStreams.map((stream, index) => (
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
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};
export default WebRTC;
