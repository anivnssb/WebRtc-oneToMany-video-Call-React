import React from 'react';
import { ImPhoneHangUp } from 'react-icons/im';
import { useEffect, useRef, useState } from 'react';
import useObserveWidth from '../hooks/useObserveWidth';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';

const LocalVideo = ({ localVideoRef, inCall, hangup, pinnedClient }) => {
  const [overlayBtnContainerRef, width] = useObserveWidth();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const enableDisableAudio = (bool) => {
    const stream = localVideoRef.current?.srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = bool;
    }
    setAudioEnabled(bool);
  };
  const enableDisableVideo = (bool) => {
    const stream = localVideoRef.current?.srcObject;
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = bool;
    }
    setVideoEnabled(bool);
  };
  return (
    <div className="text-center mb-2.5 w-fit">
      <div className="relative p-2.5 flex justify-center items-center">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-full border-[5px] border-[#111211] rounded-2xl"
        ></video>
        <div className="absolute w-4/5 h-4/5 bg-transparent rounded-2xl left-0 right-0 mx-auto flex justify-center items-center group">
          <div
            className={`flex justify-center items-center gap-4 w-1/2 h-1/2 bg-black/50 rounded-2xl invisible group-hover:visible ${
              videoEnabled ? 'invisible' : 'visible'
            }`}
            ref={overlayBtnContainerRef}
          >
            {inCall ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={hangup}
                  className="bg-red-600 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                >
                  <ImPhoneHangUp
                    size={width * 0.1}
                    color="white"
                    onClick={hangup}
                  />
                </button>
              </div>
            ) : null}
            <div className="flex flex-col gap-2.5">
              {!audioEnabled ? (
                <button
                  className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                  onClick={() => enableDisableAudio(true)}
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
                  onClick={() => enableDisableAudio(false)}
                >
                  <FaMicrophone color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              )}
              {!videoEnabled ? (
                <button
                  className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                  onClick={() => enableDisableVideo(true)}
                >
                  <FaVideoSlash color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              ) : (
                <button
                  className="bg-gray-400 rounded-full border-none cursor-pointer flex"
                  style={{ padding: width * 0.05 }}
                  onClick={() => enableDisableVideo(false)}
                >
                  <FaVideo color="rgb(50, 50, 50)" size={width * 0.1} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {inCall ? <p>You</p> : ''}
      <div></div>
    </div>
  );
};

export default LocalVideo;
