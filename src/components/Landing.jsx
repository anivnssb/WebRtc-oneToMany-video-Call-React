import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Landing = ({ setHostORClient }) => {
  const {theme}=useContext(ThemeContext)
  return (
    <div className={`Landing ${theme} bg-white dark:bg-black h-screen flex flex-col justify-center items-center`} data-testid="landing-page">
      <div className="landing-text text-black dark:text-white text-center p-5 flex flex-col content-center items-center gap-5">
        <h1 className='text-green-400 font-black'>One To Many</h1>
        <h2>Video Calling</h2>
        <h2 className="landing-h2-second">Using WebRtc Technology</h2>

        <button
          className="button-one disable-text-selection"
          onClick={() => setHostORClient('host')}
        >
          Start a Meeting
        </button>
        <button
          className="button-one disable-text-selection"
          onClick={() => setHostORClient('client')}
        >
          Join a Meeting
        </button>
      </div>
    </div>
  );
};

export default Landing;
