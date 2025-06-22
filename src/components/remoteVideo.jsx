import { useEffect, useRef } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import useObserveWidth from '../hooks/useObserveWidth';
import { FaThumbtackSlash } from 'react-icons/fa6';
import SpinnerIcon from './icons/SpinnerIcon';

const RemoteVideo = ({
  index,
  stream,
  hangupRemote,
  hostORClient,
  dispatch,
  pinnedClient,
  inCall,
}) => {
  const videoRef = useRef(null);
  const overlayBtnContainerRef = useRef(null);
  const [width] = useObserveWidth(overlayBtnContainerRef);

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
        <div className="overlay">
          <div
            className="overlay-button-container"
            ref={overlayBtnContainerRef}
          >
            <button
              onClick={() => {
                hangupRemote(index);
              }}
              className="hangup-button"
              style={{ padding: width * 0.05 }}
            >
              <ImPhoneHangUp color="white" size={width * 0.1} />
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: 'SET_PINNED_CLIENT',
                  payload: !pinnedClient ? stream?.id : null,
                })
              }
              className="pin-button"
              style={{ padding: width * 0.05 }}
            >
              {pinnedClient !== stream?.id ? (
                <FaThumbtack color="rgb(50, 50, 50)" size={width * 0.1} />
              ) : (
                <FaThumbtackSlash color="rgb(50, 50, 50)" size={width * 0.1} />
              )}
            </button>
          </div>
          {!inCall ? <SpinnerIcon /> : ''}
        </div>
      </div>
      <p>{`${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
    </div>
  );
};

export default RemoteVideo;
