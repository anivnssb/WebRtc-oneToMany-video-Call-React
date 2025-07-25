import { FaAnglesDown } from 'react-icons/fa6';
import BackArrowIcon from '../components/icons/BackArrowIcon';

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
  return (
    <div className="navbar">
      <button
        className="button back-arrow-button"
        onClick={() => {
          hangup();
          setHostORClient('');
        }}
      >
        {' '}
        <BackArrowIcon />
      </button>
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
      <div className="navbar-right-side">
        {hostORClient === 'host' && inCall ? (
          <button
            className="add-new-client"
            style={{ width: 'fit-content', height: 'fit-content' }}
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
          className={`offer-answer-expand-icon ${
            offerAnswerVisibile ? 'roate-icon' : ''
          }`}
          onClick={() =>
            dispatch({
              type: 'OFFER_ANSWER_VISIBLE',
              payload: !offerAnswerVisibile,
            })
          }
        >
          <FaAnglesDown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
