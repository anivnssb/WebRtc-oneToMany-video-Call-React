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
    <div className="navbar bg-gray-200 dark:bg-gray-700 flex flex-row justify-between items-center p-2.5 pl-0 sticky top-0 z-999">
      <div
        className="p-2.5 cursor-pointer"
        onClick={() => {
          hangup();
          setHostORClient('');
        }}
      >
        <FaChevronLeft className='text-black dark:text-white 
        transition-colors delay-100 ease-linear hover:text-blue-400'/>
      </div>
      {/* <div className="connection-status">
        {waitingForPeer ? (
          <h2> waiting for peer to respond... </h2>
        ) : (
          <h1>
            {peerConnection[0]?.connectionState === 'new'
              ? hostORClient === 'host'
                ? 'Start a meeting'
                : 'join a meeting'
              : peerConnection[0]?.connectionState ?? 'no state'}
          </h1>
        )}
      </div> */}
      <div className="navbar-right-side flex content-center items-center gap-5">
        {hostORClient === 'host' && inCall||true ? (
          <button
            className="add-new-client bg-transparent text-black dark:text-white  
            border-2 border-gray-800 dark:border-white border-solid rounded-3xl p-1.75 cursor-pointer 
            transition-colors delay-100 ease-linear hover:border-blue-400"
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
            Add new client{' '}
          </button>
        ) : (
          ''
        )}

        <div
          className={`offer-answer-expand-icon p-2.5  ${
            offerAnswerVisibile ? 'roate-icon' : ''
          }`}
          onClick={() =>
            dispatch({
              type: 'OFFER_ANSWER_VISIBLE',
              payload: !offerAnswerVisibile,
            })
          }
        >
          <FaAnglesDown  className='text-black dark:text-white transition-colors delay-100 ease-linear hover:text-blue-400 cursor-pointer'/>
        </div>
        <div onClick={toggleTheme} className='p-2.5'>
          <FaMoon className='text-black dark:text-white transition-colors delay-100 ease-linear hover:text-blue-400 cursor-pointer'/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
