const OfferAndAnswer = ({
  offer,
  hostORClient,
  startCall,
  answerCall,
  answer,
  dispatch,
  onAnswer,
  offerAnswerVisibile,
}) => {
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div
      className={`offer-and-answer-container bg-gray-900
         dark:bg-amber-50 h-fit w-fit p-2.5 pb-5 rounded-2xl flex 
        flex-col content-center items-center 
        absolute right-0 z-[999] transition-transform 
        delay-200 ease-linear transform-[scale(0)] origin-top ${
          offerAnswerVisibile
            ? `offer-answer-expanded 
            overflow-hidden h-auto 
            transform-[scale(1)] origin-top`
            : ""
        }`}
    >
      {/* OFFER */}
      <div className="offer-answer">
        {true ? <h3>Offer</h3> : ""}
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
          rows="10"
          cols="50"
        />
        {hostORClient === "host" ? (
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
        ) : true ? (
          <div className="connect-buttons-container">
            <button
              className="button-two disable-text-selection"
              onClick={() => answerCall("test")}
            >
              Answer Call{" "}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="offer-answer">
        {true ? <h3>Answer</h3> : ""}
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
          rows="10"
          cols="50"
        />

        <div className="connect-buttons-container">
          {hostORClient === "host" ? (
            <button
              className="button-two  disable-text-selection"
              onClick={() => onAnswer(JSON.parse(answer[answer.length - 1]))}
            >
              Connect{" "}
            </button>
          ) : (
            ""
          )}
          {hostORClient === "client" ? (
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
