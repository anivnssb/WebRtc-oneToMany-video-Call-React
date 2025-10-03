import { useRef } from "react";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";

interface OfferAndAnswerProps {
  hostORClient: string;
  dispatch: React.Dispatch<any>;
  startCall: () => Promise<void>;
  answerCall: (offer: string) => Promise<void>;
  offerAnswerVisibile: boolean;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}
const OfferAndAnswer = ({
  hostORClient,
  startCall,
  answerCall,
  dispatch,
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
        <h2>{`${hostORClient === "host" ? "Client" : "Your"}`} Email</h2>
        <input
          type="text"
          ref={inputRef}
          placeholder={`${
            hostORClient === "host" ? "Client" : "Your"
          } Email Id`}
          onChange={(e) => {
            if (hostORClient === "host") {
              dispatch({
                type: "SET_EMAIL",
                payload: e.target.value,
              });
            }
          }}
        />
        <div className="connect-buttons-container">
          <button
            className="button-two disable-text-selection"
            onClick={() => {
              if (inputRef.current?.value) {
                if (hostORClient === "host") {
                  startCall();
                  return;
                }
                if (hostORClient === "client") {
                  socket.emit("requestMeetingData", {
                    email: inputRef.current?.value,
                  });
                  socket.on("sendMeetingData", (data) => {
                    if (data.email === inputRef.current?.value) {
                      answerCall(data.offer);
                    }
                  });
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
