import { ImPhoneHangUp } from 'react-icons/im';
import InfoIcon from './IIcon';

const LocalVideo = ({ localVideoRef, inCall, hangup, pinnedClient }) => {
  return (
    <div
      className={`local-video-container ${
        inCall ? (pinnedClient ? 'client-pinned' : '') : 'not-conneted'
      }`}
    >
      <div className="video-wraper">
        <video ref={localVideoRef} autoPlay></video>
        <div className={inCall ? 'overlay' : ''}>
          <div className="hangup-button-container">
            <button onClick={hangup} className="hangup-button">
              <ImPhoneHangUp size={50} color="white" onClick={hangup} />
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
