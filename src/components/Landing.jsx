import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Landing = ({ setHostORClient }) => {
  const {theme}=useContext(ThemeContext)
  return (
    <div className={`Landing ${theme} bg-lime-100 dark:bg-black h-screen flex flex-col justify-center items-center`} data-testid="landing-page">
      <div className="landing-text text-black dark:text-white text-center p-5 flex flex-col content-center items-center gap-5">
        <h1 className='text-green-400 font-black'>One To Many</h1>
        <h2>Video Calling</h2>
        <h2 className="landing-h2-second">Using WebRtc Technology</h2>

        <button
          className="button-one cursor-pointer disable-text-selection bg-gradient-to-l from-orange-600 via-orange-600 to-yellow-400 rounded-3xl pt-1.75 pb-1.75 pl-3.75 pr-3.75 text-black dark:text-white
          transition-transform  duration-100 ease-linear hover:scale-95"
          onClick={() => setHostORClient('host')}
        >
          Start a Meeting
        </button>
        <button
          className="button-one disable-text-selection cursor-pointer disable-text-selection bg-gradient-to-r from-orange-600 via-orange-600 to-yellow-400 rounded-3xl pt-1.75 pb-1.75 pl-3.75 pr-3.75 text-black dark:text-white
          transition-transform  duration-100 ease-linear hover:scale-95" 
          onClick={() => setHostORClient('client')}
        >
          Join a Meeting
        </button>
      </div>
    </div>
  );
};

export default Landing;
