import { forwardRef, useEffect, useRef } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { FcEndCall } from 'react-icons/fc';
import { ImPhoneHangUp } from 'react-icons/im';
import observeWidth from './observeWidth';
import OverlayButtonContainer from './OverlayButtonContainer';

const RemoteVideo = ({
  index,
  stream,
  hangupRemote,
  hostORClient,
  dispatch,
  pinnedClient,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject?.id !== stream?.id) {
        videoRef.current.srcObject = stream;
      }
    }
  }, [stream]);
  return (
    <div
      className={`remote-video-container ${
        pinnedClient === stream?.id
          ? 'pinned-client'
          : pinnedClient
          ? 'client-pinned'
          : ''
      }`}
    >
      <div className="video-wraper">
        <video
          key={index + 'remote-video-element'}
          ref={videoRef}
          autoPlay
        ></video>
        <div
          className="overlay"
          onClick={() =>
            dispatch({
              type: 'SET_PINNED_CLIENT',
              payload: !pinnedClient ? stream?.id : null,
            })
          }
        >
          <OverlayButtonContainer
            {...{ hangupRemote, index, pinnedClient, streamId: stream?.id }}
          />
        </div>
      </div>
      <p>{`${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
    </div>
  );
};

export default RemoteVideo;
