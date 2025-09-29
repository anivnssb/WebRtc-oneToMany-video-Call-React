import React from "react";
interface LandingProps {
  hostORClient: string;
  setHostORClient: React.Dispatch<React.SetStateAction<string>>;
}

const Landing: React.FC<LandingProps> = ({ setHostORClient }) => {
  return (
    <div className="Landing" data-testid="landing-page">
      <div className="landing-text">
        <h1>One To Many</h1>
        <h2>Video Calling</h2>
        <h2 className="landing-h2-second">Using WebRtc Technology</h2>

        <button
          className="button-one disable-text-selection"
          onClick={() => setHostORClient("host")}
        >
          Start a Meeting
        </button>
        <button
          className="button-one disable-text-selection"
          onClick={() => setHostORClient("client")}
        >
          Join a Meeting
        </button>
      </div>
    </div>
  );
};

export default Landing;
