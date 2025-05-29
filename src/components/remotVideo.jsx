import React from 'react';
import InfoIcon from './iIcon';

const RemotVideo = ({ index, stream, hangupRemote, hostORClient }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <p>{`${
          hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
        } `}</p>
        <video
          key={index + 'ljdkn'}
          style={{
            border: '1px solid black',
            height: '200px',
            width: '260px',
          }}
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
    </div>
  );
};

export default RemotVideo;
