import { FaXmark } from "react-icons/fa6";
import { useAppDispatch } from "../state/hook";
import { updateHostORClient, updateMeetingEnded } from "../state/appEventSlice";

const MeetingEnded = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="meeting-end-dialog">
      <div className="meeing-end-message">
        <div
          className="close-icon"
          onClick={() => {
            dispatch(updateHostORClient({ hostORClient: "" }));
            dispatch(updateMeetingEnded({ isMeetingEnded: false }));
          }}
        >
          <FaXmark />
        </div>
        <p>Meeting Has Ended!</p>
      </div>
    </div>
  );
};

export default MeetingEnded;
