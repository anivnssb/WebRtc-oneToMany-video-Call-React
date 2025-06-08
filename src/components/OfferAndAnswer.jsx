import InfoIcon from './iIcon';

const OfferAndAnswer = ({
  offer,
  setOffer,
  hostORClient,
  startCall,
  answerCall,
  answer,
  setAnswer,
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
          id="offer123"
          style={{ width: '260px' }}
          value={
            offer[offer.length - 1]
              ? JSON.stringify(offer[offer.length - 1])
              : ''
          }
          onChange={(e) => {
            setOffer((prev) => [...prev, e.target.value]);
          }}
          rows="10"
          cols="50"
        />
        {hostORClient === 'host' ? (
          <div>
            <button onClick={startCall}>
              Start Call{' '}
              <span className="tooltip">
                <InfoIcon />
                <span className="tooltiptext">
                  Use this button to start a call and generate offer then copy
                  the generated offer
                </span>
              </span>
            </button>{' '}
            <button
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
          <button onClick={() => answerCall('test')}>
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
          id="answer123"
          style={{ width: '260px' }}
          value={
            answer[answer.length - 1]
              ? JSON.stringify(answer[answer.length - 1])
              : ''
          }
          onChange={(e) => {
            if (answer.length === 1) {
              setAnswer((prev) => [...prev, e.target.value]);
            } else {
              const ans = [...answer];
              ans.pop();
              ans.push(e.target.value);
              setAnswer(ans);
            }
          }}
          rows="10"
          cols="50"
        />

        <div>
          {hostORClient === 'host' ? (
            <button
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
