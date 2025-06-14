import React from 'react';

const Landing = ({ hostORClient, setHostORClient }) => {
  return (
    <div className="Landing">
      <button className="button" onClick={() => setHostORClient('host')}>
        Start a Meeting
      </button>
      <button className="button" onClick={() => setHostORClient('client')}>
        Join a Meeting
      </button>
    </div>
  );
};

export default Landing;
