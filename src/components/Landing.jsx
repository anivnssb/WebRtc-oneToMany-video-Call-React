import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Landing = ({ setHostORClient }) => {
  const {theme}=useContext(ThemeContext)
  return (
    <div className={`bg-lime-100 dark:bg-black h-screen flex flex-col justify-center items-center ${theme}`} data-testid="landing-page">
      <div className="text-black dark:text-white text-center p-5 flex flex-col items-center gap-5">
        <h1 className='text-green-400 font-black'>One To Many</h1>
        <h2>Video Calling</h2>
        <h2>Using WebRtc Technology</h2>
        <button
          className="cursor-pointer bg-gradient-to-l from-orange-600 via-orange-600 to-yellow-400 rounded-3xl py-1.5 px-4 text-black dark:text-white transition-transform duration-100 ease-linear hover:scale-95 select-none"
          onClick={() => setHostORClient('host')}
        >
          Start a Meeting
        </button>
        <button
          className="cursor-pointer bg-gradient-to-r from-orange-600 via-orange-600 to-yellow-400 rounded-3xl py-1.5 px-4 text-black dark:text-white transition-transform duration-100 ease-linear hover:scale-95 select-none"
          onClick={() => setHostORClient('client')}
        >
          Join a Meeting
        </button>
      </div>
    </div>
  );
};

export default Landing;
