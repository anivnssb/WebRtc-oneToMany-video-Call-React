import { useRef } from "react";

interface OfferAndAnswerProps {
  hostORClient: string;
  dispatch: React.Dispatch<any>;
  startCall: () => Promise<void>;
  answerCall: (offer: string) => Promise<void>;
  offerAnswerVisibile: boolean;
  offerReceivedFromHost: string;
  room: string;
}
const OfferAndAnswer = ({
  hostORClient,
  startCall,
  answerCall,
  dispatch,
  offerAnswerVisibile,
  offerReceivedFromHost,
  room,
}: OfferAndAnswerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`offer-and-answer-container ${
        offerAnswerVisibile ? "offer-answer-expanded" : ""
      }`}
    >
      <div className="offer-answer">
        <h2>Create Room</h2>
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter Room Number"
          onChange={(e) => {
            if (hostORClient === "host") {
              dispatch({
                type: "SET_ROOM",
                payload: e.target.value,
              });
            }
          }}
        />
        <div className="connect-buttons-container">
          <button
            className="button-two disable-text-selection"
            onClick={() => {
              console.log(room);
              if (inputRef.current?.value) {
                hostORClient === "host" && startCall();
                if (
                  hostORClient === "client" &&
                  room === inputRef.current?.value
                ) {
                  answerCall(offerReceivedFromHost);
                }
              }
            }}
          >
            {hostORClient === "host" ? "Start Meeting" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferAndAnswer;
