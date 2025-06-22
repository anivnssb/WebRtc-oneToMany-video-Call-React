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
    <div className="header">
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
      <div className="connection-status">
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
      </div>
      {hostORClient === 'host' && inCall ? (
        <button
          className="button"
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
          {/* <span className="tooltip">
              <InfoIcon />
              <span className="tooltiptext">
                Use this button to add new client to the meeting, click this
                button and then click the startCall button
              </span>
            </span> */}
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default Navbar;
