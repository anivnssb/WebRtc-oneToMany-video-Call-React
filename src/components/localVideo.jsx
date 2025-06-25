import { ImPhoneHangUp } from 'react-icons/im';
import { useEffect, useRef, useState } from 'react';
import useObserveWidth from '../hooks/useObserveWidth';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';

const LocalVideo = ({ localVideoRef, inCall, hangup, pinnedClient }) => {
  const overlayBtnContainerRef = useRef(null);
  const [width] = useObserveWidth(overlayBtnContainerRef);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const enableDisableAudio = (bool) => {
    const stream = localVideoRef.current?.srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = bool;
    }
    setAudioEnabled(bool);
  };
  const enableDisableVideo = (bool) => {
    const stream = localVideoRef.current?.srcObject;
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = bool;
    }
    setVideoEnabled(bool);
  };
  return (
    <div
      className={`local-video-container ${
        inCall ? (pinnedClient ? 'client-pinned' : '') : 'not-connected'
      }`}
    >
      <div className="video-wraper">
        <video ref={localVideoRef} autoPlay muted></video>
        <div className="overlay">
          <div
            className={`overlay-button-container ${
              videoEnabled ? '' : 'overlay-button-container-visible'
            }`}
            ref={overlayBtnContainerRef}
          >
            {inCall ? (
              <div className="ctrl-button-group1">
                <button
                  onClick={hangup}
                  className="hangup-button"
                  style={{ padding: width * 0.05 }}
                >
                  <ImPhoneHangUp
                    size={width * 0.1}
                    color="white"
                    onClick={hangup}
                  />
                </button>
              </div>
            ) : (
              ''
            )}
            <div className="ctrl-button-group2">
              {!audioEnabled ? (
                <button
                  className="vdo-control-button "
                  style={{ padding: width * 0.05 }}
                  onClick={() => enableDisableAudio(true)}
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
                  onClick={() => enableDisableAudio(false)}
                >
                  <FaMicrophone color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              )}
              {!videoEnabled ? (
                <button
                  className="vdo-control-button "
                  style={{ padding: width * 0.05 }}
                  onClick={() => enableDisableVideo(true)}
                >
                  <FaVideoSlash color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              ) : (
                <button
                  className="vdo-control-button "
                  style={{ padding: width * 0.05 }}
                  onClick={() => enableDisableVideo(false)}
                >
                  <FaVideo color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {inCall ? <p>You</p> : ''}
      <div></div>
    </div>
  );
};

export default LocalVideo;
