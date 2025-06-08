import InfoIcon from './iIcon';

const RemotVideo = ({ index, stream, hangupRemote, hostORClient }) => {
  return (
    <div className="remote-video-container">
      <p>{`${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
      <video
        key={index + 'ljdkn'}
        ref={(el) => {
          if (el) el.srcObject = stream;
        }}
        autoPlay
      ></video>
      <div>
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
  );
};

export default RemotVideo;
