import React from 'react';

const Landing = ({ hostORClient, setHostORClient }) => {
  return (
    <div className="Landing">
      {' '}
      <h3>start by selecting host or client</h3>
      <div>
        <input
          type="radio"
          id="host"
          name="clientOrHost"
          value="host"
          onChange={() => setHostORClient('host')}
        />
          <label for="host">Host</label> {' '}
        <input
          type="radio"
          id="client"
          name="clientOrHost"
          value="client"
          onChange={() => setHostORClient('client')}
        />
          <label for="client">Client</label>
      </div>
    </div>
  );
};

export default Landing;
