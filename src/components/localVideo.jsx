import InfoIcon from './IIcon';

const LocalVideo = ({ localVideoRef, inCall, hangup }) => {
  return (
    <div className={`local-video-container ${inCall ? '' : 'not-conneted'}`}>
      <div className="video-wraper">
        <video ref={localVideoRef} autoPlay></video>
        <div className={inCall ? 'overlay' : ''}>
          <div className="hangup-button-container">
            <button onClick={hangup}>Hang Up</button>
          </div>
        </div>
      </div>
      <p>You</p>
      <div></div>
    </div>
  );
};

export default LocalVideo;
