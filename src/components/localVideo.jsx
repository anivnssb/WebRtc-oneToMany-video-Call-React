import InfoIcon from './iIcon';

const LocalVideo = ({ localVideoRef, inCall, hangup }) => {
  return (
    <div className="local-video-container">
      <p>You</p>
      <video ref={localVideoRef} autoPlay></video>
      <div>
        {inCall && (
          <button onClick={hangup}>
            Hang Up{' '}
            <span className="tooltip">
              <InfoIcon />
              <span className="tooltiptext">
                Use this button to end the meeting
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LocalVideo;
