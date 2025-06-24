import { ImPhoneHangUp } from 'react-icons/im';
import { useEffect, useRef, useState } from 'react';
import useObserveWidth from '../hooks/useObserveWidth';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const LocalVideo = ({ localVideoRef, inCall, hangup, pinnedClient }) => {
  const overlayBtnContainerRef = useRef(null);
  const [width] = useObserveWidth(overlayBtnContainerRef);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const muteUser = (bool) => {
    const stream = localVideoRef.current.srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = bool;
    }
    setAudioEnabled(bool);
  };
  useEffect(() => {
    const stream = localVideoRef.current?.srcObject;
    const audioTrack = stream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = false;
    }
  }, []);
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
            className="overlay-button-container"
            ref={overlayBtnContainerRef}
          >
            {inCall ? (
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
            ) : (
              ''
            )}
            {!audioEnabled ? (
              <button
                className="vdo-control-button "
                style={{ padding: width * 0.05 }}
                onClick={() => muteUser(true)}
              >
                <FaMicrophoneSlash color="rgb(50, 50, 50)" size={width * 0.1} />
              </button>
            ) : (
              <button
                className="vdo-control-button "
                style={{ padding: width * 0.05 }}
                onClick={() => muteUser(false)}
              >
                <FaMicrophone color="rgb(50, 50, 50)" size={width * 0.1} />
              </button>
            )}
          </div>
        </div>
      </div>
      {inCall ? <p>You</p> : ''}
      <div></div>
    </div>
  );
};

export default LocalVideo;
