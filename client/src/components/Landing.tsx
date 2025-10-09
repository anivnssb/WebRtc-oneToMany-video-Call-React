import React from "react";
import { useAppDispatch } from "../state/hook";
import { updateHostORClient } from "../state/appEventSlice";

const Landing: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="Landing" data-testid="landing-page">
      <div className="landing-text">
        <h1>One To Many</h1>
        <h2>Video Calling</h2>
        <h2 className="landing-h2-second">Using WebRtc Technology</h2>

        <button
          className="button-one disable-text-selection"
          onClick={() => dispatch(updateHostORClient({ hostORClient: "host" }))}
        >
          Start a Meeting
        </button>
        <button
          className="button-one disable-text-selection"
          onClick={() =>
            dispatch(updateHostORClient({ hostORClient: "client" }))
          }
        >
          Join a Meeting
        </button>
      </div>
    </div>
  );
};

export default Landing;
