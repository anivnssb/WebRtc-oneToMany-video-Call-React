const RemotVideo = ({ index, stream, hangupRemote, hostORClient }) => {
  return (
    <div className="remote-video-container">
      <div className="video-wraper">
        <video
          key={index + 'remote-video-element'}
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
              Hang Up
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
