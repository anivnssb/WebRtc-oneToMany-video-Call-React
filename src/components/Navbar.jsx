import BackArrowIcon from './BackArrowIcon';

const Navbar = ({
  setHostORClient,
  waitingForPeer,
  peerConnection,
  hostORClient,
  inCall,
  setAnswer,
  createpeerConnectionForRemote,
}) => {
  return (
    <div className="header">
      <button
        className="button back-arrow-button"
        onClick={() => setHostORClient('')}
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
                ? 'meeting not started'
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
            setAnswer((prev) => [...prev, 'new remote video']);
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
