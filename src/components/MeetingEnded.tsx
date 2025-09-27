import { FaXmark } from 'react-icons/fa6';

const MeetingEnded = ({ setHostORClient }) => {
  return (
    <div className="meeting-end-dialog">
      <div className="meeing-end-message">
        <div
          className="close-icon"
          onClick={() => {
            setHostORClient('');
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
