import { ImPhoneHangUp } from 'react-icons/im';
import InfoIcon from './IIcon';
import { useEffect, useRef } from 'react';
import useObserveWidth from '../hooks/useObserveWidth';

const LocalVideo = ({ localVideoRef, inCall, hangup, pinnedClient }) => {
  const overlayBtnContainerRef = useRef(null);
  const [width] = useObserveWidth(overlayBtnContainerRef);
  return (
    <div
      className={`local-video-container ${
        inCall ? (pinnedClient ? 'client-pinned' : '') : 'not-conneted'
      }`}
    >
      <div className="video-wraper">
        <video ref={localVideoRef} autoPlay></video>
        <div className={inCall ? 'overlay' : ''}>
          <div
            className="overlay-button-container"
            ref={overlayBtnContainerRef}
          >
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
        </div>
      </div>
      <p>You</p>
      <div></div>
    </div>
  );
};

export default LocalVideo;
