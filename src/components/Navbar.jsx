import BackArrowIcon from '../components/icons/BackArrowIcon';

const Navbar = ({
  setHostORClient,
  waitingForPeer,
  peerConnection,
  hostORClient,
  inCall,
  dispatch,
  answer,
  createpeerConnectionForRemote,
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
      {hostORClient === 'host' && inCall ? (
        <button
          className="add-new-client"
          style={{ width: 'fit-content', height: 'fit-content' }}
          onClick={() => {
            dispatch({
              type: 'SET_ANSWER',
              payload: [
                ...answer,
                'clear this text and paste the answer from the new clent',
              ],
            });
            createpeerConnectionForRemote();
          }}
        >
          Add new client{' '}
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default Navbar;
