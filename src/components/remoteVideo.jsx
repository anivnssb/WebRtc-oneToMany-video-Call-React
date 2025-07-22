import { useEffect, useRef, useState } from 'react';
import {
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaThumbtack,
} from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import useObserveWidth from '../hooks/useObserveWidth';
import { FaThumbtackSlash } from 'react-icons/fa6';
import SpinnerIcon from './icons/SpinnerIcon';

const RemoteVideo = ({
  index,
  stream,
  hangupRemote,
  hostORClient,
  dispatch,
  pinnedClient,
  inCall,
  remoteStreams,
}) => {
  const videoRef = useRef(null);
  const [overlayBtnContainerRef, width] = useObserveWidth();
  const [mute, setMute] = useState(true);

  const goFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Safari
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen(); // IE
    }
  };

  const muteUser = (bool) => {
    if (videoRef.current) {
      videoRef.current.muted = bool;
      setMute(bool);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject?.id !== stream?.id) {
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
      }
    }
  }, [stream]);
  return (
    <div className="text-center mb-2.5 w-fit">
      <div className="relative p-2.5 flex justify-center items-center">
        <video
          key={index + 'remote-video-element'}
          ref={videoRef}
          autoPlay
          className="w-full border-[5px] border-[#111211] rounded-2xl"
        ></video>
        <div className="absolute w-4/5 h-4/5 bg-transparent rounded-2xl left-0 right-0 mx-auto flex justify-center items-center group">
          <div
            className="flex justify-center items-center gap-4 w-1/2 h-1/2 bg-black/50 rounded-2xl invisible group-hover:visible"
            ref={overlayBtnContainerRef}
          >
            <div className="flex flex-col gap-2.5">
              {hostORClient === 'host' ? (
                <button
                  onClick={() => {
                    const index = remoteStreams.findIndex(
                      ({ id }) => id === stream?.id
                    );
                    hangupRemote(index);
                  }}
                  className="bg-red-600 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                >
                  <ImPhoneHangUp color="white" size={width * 0.1} />
                </button>
              ) : null}
              <button
                onClick={() =>
                  dispatch({
                    type: 'SET_PINNED_CLIENT',
                    payload: pinnedClient === stream?.id ? null : stream?.id,
                  })
                }
                className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                style={{ padding: width * 0.05 }}
              >
                {pinnedClient !== stream?.id ? (
                  <FaThumbtack color="rgb(50, 50, 50)" size={width * 0.1} />
                ) : (
                  <FaThumbtackSlash
                    color="rgb(50, 50, 50)"
                    size={width * 0.1}
                  />
                )}
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                style={{ padding: width * 0.05 }}
                onClick={goFullscreen}
              >
                <FaExpand color="rgb(50, 50, 50)" size={width * 0.1} />
              </button>
              {mute ? (
                <button
                  className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                  onClick={() => muteUser(!mute)}
                >
                  <FaMicrophoneSlash
                    color="rgb(50, 50, 50)"
                    size={width * 0.1}
                  />
                </button>
              ) : (
                <button
                  className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                  onClick={() => muteUser(!mute)}
                >
                  <FaMicrophone color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              )}
            </div>
          </div>
          {!inCall ? <SpinnerIcon /> : ''}
        </div>
      </div>
      <p>{`$${
        hostORClient === 'client' ? 'Host' : 'Client ' + (index + 1)
      } `}</p>
    </div>
  );
};

export default RemoteVideo;
