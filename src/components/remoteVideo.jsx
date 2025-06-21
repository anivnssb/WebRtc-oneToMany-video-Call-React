import { useEffect, useRef } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { FcEndCall } from 'react-icons/fc';
import { ImPhoneHangUp } from 'react-icons/im';

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
          <div className="overlay-button-container">
            <button
              onClick={() => {
                hangupRemote(index);
              }}
              className="hangup-button"
            >
              <ImPhoneHangUp color="white" />
            </button>
            <button onClick={() => {}} className="pin-button">
              <FaThumbtack color="rgb(50, 50, 50)" />
            </button>
          </div>
        </div>
      </div>
      <p>{`${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
    </div>
  );
};

export default RemoteVideo;
