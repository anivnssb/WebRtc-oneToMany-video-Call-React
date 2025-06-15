import InfoIcon from './IIcon';

const RemotVideo = ({ index, stream, hangupRemote, hostORClient }) => {
  return (
    <div className="remote-video-container">
      <div className="video-wraper">
        <video
          key={index + 'ljdkn'}
          ref={(el) => {
            if (el) el.srcObject = stream;
          }}
          autoPlay
        ></video>
        <div className="overlay">
          <div className="hangup-button-container">
            <button
              onClick={() => {
                hangupRemote(index);
              }}
            >
              Hang Up{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to end the call with client
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <p>{`${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
    </div>
  );
};

export default RemotVideo;
