import InfoIcon from './IIcon';

const LocalVideo = ({ localVideoRef, inCall, hangup }) => {
  return (
    <div className={`local-video-container ${inCall ? '' : 'not-conneted'}`}>
      <p>You</p>
      <div className="video-wraper">
        <video ref={localVideoRef} autoPlay></video>
        <div className={inCall ? 'overlay' : ''}>
          <div className="hangup-button-container">
            <button onClick={hangup}>
              Hang Up{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to end the meeting
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default LocalVideo;
