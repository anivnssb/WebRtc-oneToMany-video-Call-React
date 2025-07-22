import { FaXmark } from 'react-icons/fa6';

const MeetingEnded = ({ setHostORClient }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-[999] backdrop-blur-sm">
      <div className="w-4/5 md:w-1/3 p-4 flex flex-col justify-center items-center rounded-2xl bg-white/90 border border-gray-800 relative transition-transform duration-200">
        <div
          className="absolute top-0 right-0 p-2 pr-4 cursor-pointer hover:scale-95 transition-transform"
          onClick={() => {
            setHostORClient('');
          }}
        >
          <FaXmark />
        </div>
        <p className="text-lg font-semibold text-gray-900">Meeting Has Ended!</p>
      </div>
    </div>
  );
};

export default MeetingEnded;
