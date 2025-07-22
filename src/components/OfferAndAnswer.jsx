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
      className={`
        bg-gray-900 dark:bg-amber-50 h-fit w-fit p-2.5 pb-5 rounded-2xl flex flex-col items-center absolute right-0 z-[999] transition-transform duration-200 ease-linear origin-top
        ${offerAnswerVisibile ? 'overflow-hidden h-auto scale-y-100' : 'scale-y-0'}
      `}
    >
      {/* OFFER */}
      <div className="pt-2.5 w-[85%] flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">Offer</h3>
        <textarea
          className="h-fit w-4/5 p-2.5 mt-2.5 rounded-lg border-none bg-black text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 scrollbar-hide"
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
          <div className="flex justify-around gap-2.5 mt-2.5">
            <button
              className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-full border-none px-4 py-2 text-gray-300 cursor-pointer transition-transform duration-200 active:scale-95 select-none"
              onClick={startCall}
            >
              Start Call
            </button>
            <button
              className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-full border-none px-4 py-2 text-gray-300 cursor-pointer transition-transform duration-200 active:scale-95 select-none"
              onClick={() => copyText(JSON.stringify(offer[offer.length - 1]))}
            >
              Copy Offer
            </button>
          </div>
        ) : (
          <div className="flex justify-around gap-2.5 mt-2.5">
            <button
              className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-full border-none px-4 py-2 text-gray-300 cursor-pointer transition-transform duration-200 active:scale-95 select-none"
              onClick={() => answerCall("test")}
            >
              Answer Call
            </button>
          </div>
        )}
      </div>
      <div className="pt-2.5 w-[85%] flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">Answer</h3>
        <textarea
          className="h-fit w-4/5 p-2.5 mt-2.5 rounded-lg border-none bg-black text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 scrollbar-hide"
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
        <div className="flex justify-around gap-2.5 mt-2.5">
          {hostORClient === "host" ? (
            <button
              className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-full border-none px-4 py-2 text-gray-300 cursor-pointer transition-transform duration-200 active:scale-95 select-none"
              onClick={() => onAnswer(JSON.parse(answer[answer.length - 1]))}
            >
              Connect
            </button>
          ) : null}
          {hostORClient === "client" ? (
            <button
              className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-full border-none px-4 py-2 text-gray-300 cursor-pointer transition-transform duration-200 active:scale-95 select-none"
              onClick={() => copyText(JSON.stringify(answer[answer.length - 1]))}
            >
              Copy Answer
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OfferAndAnswer;
