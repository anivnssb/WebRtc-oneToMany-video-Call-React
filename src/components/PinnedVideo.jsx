import React, { useEffect, useRef } from 'react';
import useObserveWidth from '../hooks/useObserveWidth';
import { ImPhoneHangUp } from 'react-icons/im';
import { FaThumbtackSlash } from 'react-icons/fa6';

const PinnedVideo = ({
  hangupRemote,
  dispatch,
  hostORClient,
  remoteStreams,
  pinnedClient,
  stream,
  index,
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
    <div className="remote-video-container">
      <div className="video-wraper">
        <video ref={videoRef} autoPlay></video>
        <div className="overlay">
          <div
            className="overlay-button-container"
            ref={overlayBtnContainerRef}
            width={800}
          >
            <button
              onClick={() => {
                hangupRemote(index);
                dispatch({
                  type: 'SET_PINNED_CLIENT',
                  payload: null,
                });
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
                  payload: null,
                })
              }
              className="pin-button"
              style={{ padding: width * 0.05 }}
            >
              <FaThumbtackSlash color="rgb(50, 50, 50)" size={width * 0.1} />
            </button>
          </div>
          +
        </div>
      </div>
      <p>{`${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
    </div>
  );
};

export default PinnedVideo;
