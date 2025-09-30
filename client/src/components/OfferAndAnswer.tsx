interface OfferAndAnswerProps {
  hostORClient: string;
  dispatch: React.Dispatch<any>;
  answer: string[];
  offer: [];
  startCall: () => Promise<void>;
  answerCall: () => Promise<void>;
  onAnswer: (answer: { sdp: string; type: RTCSdpType }) => Promise<void>;
  offerAnswerVisibile: string;
}
const OfferAndAnswer = ({
  offer,
  hostORClient,
  startCall,
  answerCall,
  answer,
  dispatch,
  onAnswer,
  offerAnswerVisibile,
}: OfferAndAnswerProps) => {
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div
      className={`offer-and-answer-container ${
        offerAnswerVisibile ? "offer-answer-expanded" : ""
      }`}
    >
      {/* OFFER */}
      <div className="offer-answer">
        {offerAnswerVisibile ? <h3>Offer</h3> : ""}
        <textarea
          value={
            offer[offer.length - 1]
              ? JSON.stringify(offer[offer.length - 1])
              : ""
          }
          onChange={(e) => {
            dispatch({
              type: "SET_OFFER",
              payload: [...offer, e.target.value],
            });
          }}
          rows={10}
          cols={50}
        />
        {hostORClient === "host" && offerAnswerVisibile ? (
          <div className="connect-buttons-container">
            <button
              className="button-two disable-text-selection"
              onClick={startCall}
            >
              Start Call{" "}
            </button>
            <button
              className="button-two disable-text-selection"
              onClick={() => copyText(JSON.stringify(offer[offer.length - 1]))}
            >
              Copy Offer{" "}
            </button>
          </div>
        ) : offerAnswerVisibile ? (
          <div className="connect-buttons-container">
            <button
              className="button-two disable-text-selection"
              onClick={() => answerCall()}
            >
              Answer Call{" "}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="offer-answer">
        {offerAnswerVisibile ? <h3>Answer</h3> : ""}
        <textarea
          value={
            answer[answer.length - 1]
              ? JSON.stringify(answer[answer.length - 1])
              : ""
          }
          onChange={(e) => {
            if (answer.length === 1) {
              dispatch({
                type: "SET_ANSWER",
                payload: [...answer, e.target.value],
              });
            } else {
              const ans = [...answer];
              ans.pop();
              ans.push(e.target.value);
              dispatch({ type: "SET_ANSWER", payload: ans });
            }
          }}
          rows={10}
          cols={50}
        />

        <div className="connect-buttons-container">
          {hostORClient === "host" && offerAnswerVisibile ? (
            <button
              className="button-two  disable-text-selection"
              onClick={() => {
                onAnswer(JSON.parse(answer[answer.length - 1]));
                console.log(JSON.parse(answer[answer.length - 1]));
              }}
            >
              Connect{" "}
            </button>
          ) : (
            ""
          )}
          {hostORClient === "client" && offerAnswerVisibile ? (
            <button
              className="button-two disable-text-selection"
              onClick={() =>
                copyText(JSON.stringify(answer[answer.length - 1]))
              }
            >
              Copy Answer{" "}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferAndAnswer;
