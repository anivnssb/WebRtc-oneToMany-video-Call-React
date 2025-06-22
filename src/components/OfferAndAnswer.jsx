import InfoIcon from '../components/icons/IIcon';

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
            </button>
            <button
              className="button connect-buttons"
              onClick={() => copyText(JSON.stringify(offer[offer.length - 1]))}
            >
              Copy Offer{' '}
            </button>
          </div>
        ) : (
          <button
            className="button connect-buttons"
            onClick={() => answerCall('test')}
          >
            Answer Call{' '}
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
