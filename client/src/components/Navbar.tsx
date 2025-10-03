import { FaAnglesDown } from "react-icons/fa6";
import BackArrowIcon from "./icons/BackArrowIcon";
import type React from "react";
interface NavbarProps {
  setHostORClient: React.Dispatch<React.SetStateAction<string>>;
  hostORClient: string;
  inCall: boolean;
  dispatch: React.Dispatch<any>;
  createNewPeerConnectionForRemote: () => Promise<void>;
  offerAnswerVisibile: boolean;
  hangup: () => void;
  resetOfferSentRef: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  setHostORClient,
  hostORClient,
  inCall,
  dispatch,
  createNewPeerConnectionForRemote,
  offerAnswerVisibile,
  hangup,
  resetOfferSentRef,
}) => {
  return (
    <div className="navbar">
      <button
        className="button back-arrow-button"
        onClick={() => {
          hangup();
          setHostORClient("");
        }}
      >
        {" "}
        <BackArrowIcon />
      </button>
      {inCall && hostORClient === "client" ? (
        ""
      ) : (
        <div className="navbar-right-side">
          {hostORClient === "host" && inCall ? (
            <button
              className="add-new-client"
              style={{ width: "fit-content", height: "fit-content" }}
              onClick={() => {
                dispatch({
                  type: "SET_ANSWER",
                  payload: "",
                });
                dispatch({
                  type: "SET_OFFER",
                  payload: "",
                });
                resetOfferSentRef();
                createNewPeerConnectionForRemote();
                dispatch({
                  type: "OFFER_ANSWER_VISIBLE",
                  payload: true,
                });
              }}
            >
              Add new client{" "}
            </button>
          ) : (
            ""
          )}

          <div
            className={`offer-answer-expand-icon ${
              offerAnswerVisibile ? "roate-icon" : ""
            }`}
            onClick={() =>
              dispatch({
                type: "OFFER_ANSWER_VISIBLE",
                payload: !offerAnswerVisibile,
              })
            }
          >
            <FaAnglesDown />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
