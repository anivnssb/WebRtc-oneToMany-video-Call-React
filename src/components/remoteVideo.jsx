import { useEffect, useRef } from 'react';
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
          <div className="hangup-button-container">
            <button
              onClick={() => {
                hangupRemote(index);
              }}
              className="hangup-button"
            >
              <ImPhoneHangUp
                size={50}
                color="white"
                onClick={() => {
                  hangupRemote(index);
                }}
              />
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
