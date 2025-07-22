import { FaAnglesDown } from 'react-icons/fa6';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';
import { FaChevronLeft, FaMoon } from 'react-icons/fa';

const Navbar = ({
  setHostORClient,
  hostORClient,
  inCall,
  dispatch,
  answer,
  createNewPeerConnectionForRemote,
  peerConnection,
  offer,
  offerAnswerVisibile,
  hangup,
}) => {
  const {toggleTheme}=useContext(ThemeContext)
  return (
    <div className="bg-gray-200 dark:bg-gray-700 flex flex-row justify-between items-center p-2.5 pl-0 sticky top-0 z-[999]">
      <div
        className="p-2.5 cursor-pointer"
        onClick={() => {
          hangup();
          setHostORClient('');
        }}
      >
        <FaChevronLeft className='text-black dark:text-white transition-colors duration-100 ease-linear hover:text-blue-400'/>
      </div>
      <div className="flex items-center gap-5">
        {hostORClient === 'host' && inCall ? (
          <button
            className="bg-transparent text-black dark:text-white border-2 border-gray-800 dark:border-white border-solid rounded-3xl px-3 py-1 cursor-pointer transition-colors duration-100 ease-linear hover:border-blue-400"
            onClick={() => {
              if (offer.length !== peerConnection.length) {
                return;
              }
              dispatch({
                type: 'SET_ANSWER',
                payload: [
                  ...answer,
                  'clear this text and paste the answer from the new clent',
                ],
              });
              createNewPeerConnectionForRemote();
            }}
          >
            Add new client
          </button>
        ) : null}
        <div
          className={`p-2.5 cursor-pointer flex items-center text-black dark:text-white hover:text-blue-400 transition-all duration-200 ease-linear ${offerAnswerVisibile ? 'rotate-180 origin-center' : ''}`}
          onClick={() =>
            dispatch({
              type: 'OFFER_ANSWER_VISIBLE',
              payload: !offerAnswerVisibile,
            })
          }
        >
          <FaAnglesDown/>
        </div>
        <div onClick={toggleTheme} className='p-2.5 text-black dark:text-white transition-colors duration-100 ease-linear hover:text-blue-400 cursor-pointer'>
          <FaMoon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
