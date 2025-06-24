import React, { useEffect, useRef, useState } from 'react';
import useObserveWidth from '../hooks/useObserveWidth';
import { ImPhoneHangUp } from 'react-icons/im';
import { FaThumbtackSlash } from 'react-icons/fa6';
import { FaExpand, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const PinnedVideo = ({
  hangupRemote,
  dispatch,
  hostORClient,
  stream,
  index,
}) => {
  const videoRef = useRef(null);
  const overlayBtnContainerRef = useRef(null);
  const [width] = useObserveWidth(overlayBtnContainerRef);
  const [mute, setMute] = useState(true);
  const goFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Safari
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen(); // IE
    }
  };
  const muteUser = (bool) => {
    if (videoRef.current) {
      videoRef.current.muted = bool;
      setMute(bool);
    }
  };
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject?.id !== stream?.id) {
        videoRef.current.muted = true;
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
            <div className="ctrl-button-group1">
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
            <div className="ctrl-button-group1">
              {' '}
              <button
                className="vdo-control-button "
                style={{ padding: width * 0.05 }}
                onClick={goFullscreen}
              >
                <FaExpand color="rgb(50, 50, 50)" size={width * 0.1} />
              </button>
              {mute ? (
                <button
                  className="vdo-control-button "
                  style={{ padding: width * 0.05 }}
                  onClick={() => muteUser(!mute)}
                >
                  <FaMicrophoneSlash
                    color="rgb(50, 50, 50)"
                    size={width * 0.1}
                  />
                </button>
              ) : (
                <button
                  className="vdo-control-button "
                  style={{ padding: width * 0.05 }}
                  onClick={() => muteUser(!mute)}
                >
                  <FaMicrophone color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              )}
            </div>
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
