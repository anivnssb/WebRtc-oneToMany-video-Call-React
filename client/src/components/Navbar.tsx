import { FaAnglesDown } from "react-icons/fa6";
import BackArrowIcon from "./icons/BackArrowIcon";
import type React from "react";
import { useAppDispatch } from "../state/hook";
import {
  updateHostORClient,
  updateOfferAnswerVisibile,
} from "../state/appEventSlice";
import { updateAnswer, updateOffer } from "../state/meetingDataSlice";
interface NavbarProps {
  hostORClient: string;
  inCall: boolean;
  createNewPeerConnectionForRemote: () => Promise<void>;
  offerAnswerVisibile: boolean;
  hangup: (fromNavbar: boolean) => void;
  resetOfferSentRef: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  hostORClient,
  inCall,
  createNewPeerConnectionForRemote,
  offerAnswerVisibile,
  hangup,
  resetOfferSentRef,
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="navbar">
      <button
        className="button back-arrow-button"
        onClick={() => {
          hangup(true);
          dispatch(updateHostORClient({ hostORClient: "" }));
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
                dispatch(updateOffer({ offer: "" }));
                dispatch(updateAnswer({ answer: "" }));
                resetOfferSentRef();
                createNewPeerConnectionForRemote();
                dispatch(
                  updateOfferAnswerVisibile({ offerAnswerVisibile: true })
                );
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
            onClick={() => {
              dispatch(
                updateOfferAnswerVisibile({
                  offerAnswerVisibile: !offerAnswerVisibile,
                })
              );
            }}
          >
            <FaAnglesDown />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
