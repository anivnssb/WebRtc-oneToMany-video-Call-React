import InfoIcon from './IIcon';

const OfferAndAnswer = ({
  offer,
  setOffer,
  hostORClient,
  startCall,
  answerCall,
  answer,
  dispatch,
  onAnswer,
}) => {
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div className="offer-and-answer-container">
      {/* OFFER */}
      <div>
        <div>Offer</div>
        <textarea
          style={{ width: '260px' }}
          value={
            offer[offer.length - 1]
              ? JSON.stringify(offer[offer.length - 1])
              : ''
          }
          onChange={(e) => {
            dispatch({
              type: 'SET_OFFER',
              payload: [...offer, e.target.value],
            });
          }}
          rows="10"
          cols="50"
        />
        {hostORClient === 'host' ? (
          <div className="connect-buttons-container">
            <button className="button connect-buttons" onClick={startCall}>
              Start Call{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to start a call and generate offer then copy
                  the generated offer
                </span>
              </span>
            </button>
            <button
              className="button connect-buttons"
              onClick={() => copyText(JSON.stringify(offer[offer.length - 1]))}
            >
              Copy Offer{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to copy the generated offer then paste this in
                  client offer input area
                </span>
              </span>
            </button>
          </div>
        ) : (
          <button
            className="button connect-buttons"
            onClick={() => answerCall('test')}
          >
            Answer Call{' '}
            <span className="tooltip">
              <InfoIcon />
              <span className="tooltiptext">
                Use this button to generate the answer then copy that answer
              </span>
            </span>
          </button>
        )}
      </div>
      <div>
        <div>Answer</div>
        <textarea
          style={{ width: '260px' }}
          value={
            answer[answer.length - 1]
              ? JSON.stringify(answer[answer.length - 1])
              : ''
          }
          onChange={(e) => {
            if (answer.length === 1) {
              dispatch({
                type: 'SET_ANSWER',
                payload: [...answer, e.target.value],
              });
            } else {
              const ans = [...answer];
              ans.pop();
              ans.push(e.target.value);
              dispatch({ type: 'SET_ANSWER', payload: ans });
            }
          }}
          rows="10"
          cols="50"
        />

        <div>
          {hostORClient === 'host' ? (
            <button
              className="button connect-buttons"
              onClick={() => onAnswer(JSON.parse(answer[answer.length - 1]))}
            >
              Connect{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to connect to client after pasting the answer
                </span>
              </span>
            </button>
          ) : (
            ''
          )}
          {hostORClient === 'client' ? (
            <button
              className="button connect-buttons"
              onClick={() =>
                copyText(JSON.stringify(answer[answer.length - 1]))
              }
            >
              Copy Answer{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to copy the Answer then paste this in the host
                  answer input area (ctrl A, cltrl V)
                </span>
              </span>
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferAndAnswer;
