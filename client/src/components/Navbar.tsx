import { FaAnglesDown } from "react-icons/fa6";
import BackArrowIcon from "./icons/BackArrowIcon";
import type React from "react";
import { useAppDispatch, useAppStateSelector } from "../state/hook";
import {
  updateHostORClient,
  updateOfferAnswerVisibile,
} from "../state/appEventSlice";
import { updateAnswer, updateOffer } from "../state/meetingDataSlice";
interface NavbarProps {
  createNewPeerConnectionForRemote: () => Promise<void>;
  hangup: (fromNavbar: boolean) => void;
  resetOfferSentRef: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  createNewPeerConnectionForRemote,
  hangup,
  resetOfferSentRef,
}) => {
  const { hostORClient, inCall, offerAnswerVisibile } = useAppStateSelector(
    (state) => state.appEvents
  );
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
      {inCall && hostORClient === "client" ? null : (
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
          ) : null}

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
