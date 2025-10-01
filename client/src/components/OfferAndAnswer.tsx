import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";
import { useRef } from "react";

interface OfferAndAnswerProps {
  hostORClient: string;
  dispatch: React.Dispatch<any>;
  answer: string[];
  offer: [];
  startCall: () => Promise<void>;
  answerCall: () => Promise<void>;
  onAnswer: (answer: { sdp: string; type: RTCSdpType }) => Promise<void>;
  offerAnswerVisibile: string;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
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
  socket,
}: OfferAndAnswerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`offer-and-answer-container ${
        offerAnswerVisibile ? "offer-answer-expanded" : ""
      }`}
    >
      <div className="offer-answer">
        <h2>Invitation</h2>
        <input type="text" ref={inputRef} />
        <div className="connect-buttons-container">
          <button
            className="button-two disable-text-selection"
            onClick={() => {
              if (inputRef.current?.value) {
                dispatch({
                  type: "SET_EMAIL",
                  payload: inputRef.current?.value,
                });
                hostORClient === "host" && startCall();
                hostORClient === "client" && answerCall();
              }
            }}
          >
            {hostORClient === "host" ? "Invite" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferAndAnswer;
