import { useEffect, useRef } from 'react';

const RemotVideo = ({ index, stream, hangupRemote, hostORClient }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject?.id !== stream?.id) {
        videoRef.current.srcObject = stream;
      }
    }
  }, [stream]);
  return (
    <div className="remote-video-container">
      <div className="video-wraper">
        <video
          key={index + 'remote-video-element'}
          ref={videoRef}
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
