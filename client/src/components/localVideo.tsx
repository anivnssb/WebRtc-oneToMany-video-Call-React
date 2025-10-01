import React from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { useState } from "react";
import useObserveWidth from "../hooks/useObserveWidth";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

interface LocalVideoProps {
  inCall: boolean;
  hangup: () => void;
}

const LocalVideo = React.forwardRef<HTMLVideoElement, LocalVideoProps>(
  ({ inCall, hangup }, localVideoRef) => {
    const [overlayBtnContainerRef, width] = useObserveWidth();
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);

    const enableDisableAudio = (bool: boolean) => {
      if (localVideoRef && "current" in localVideoRef) {
        const stream = localVideoRef?.current?.srcObject as MediaStream | null;
        const audioTrack = stream?.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = bool;
        }
        setAudioEnabled(bool);
      }
    };
    const enableDisableVideo = (bool: boolean) => {
      if (localVideoRef && "current" in localVideoRef) {
        const stream = localVideoRef?.current?.srcObject as MediaStream | null;
        const videoTrack = stream?.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = bool;
        }
        setVideoEnabled(bool);
      }
    };
    return (
      <div className="local-video-container">
        <div className="video-wraper">
          <video ref={localVideoRef} autoPlay muted></video>
          <div className="overlay">
            <div
              className={`overlay-button-container ${
                videoEnabled ? "" : "overlay-button-container-visible"
              }`}
              ref={overlayBtnContainerRef}
            >
              {inCall ? (
                <div className="ctrl-button-group1">
                  <button
                    onClick={hangup}
                    className="hangup-button"
                    style={{ padding: width * 0.05 }}
                  >
                    <ImPhoneHangUp
                      size={width * 0.1}
                      color="white"
                      onClick={hangup}
                    />
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="ctrl-button-group2">
                {!audioEnabled ? (
                  <button
                    className="vdo-control-button "
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
                    className="vdo-control-button "
                    style={{ padding: width * 0.05 }}
                    onClick={() => enableDisableAudio(false)}
                  >
                    <FaMicrophone color="rgb(50, 50, 50)" size={width * 0.1} />
                  </button>
                )}
                {!videoEnabled ? (
                  <button
                    className="vdo-control-button "
                    style={{ padding: width * 0.05 }}
                    onClick={() => enableDisableVideo(true)}
                  >
                    <FaVideoSlash color="rgb(50, 50, 50)" size={width * 0.1} />
                  </button>
                ) : (
                  <button
                    className="vdo-control-button "
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
        {inCall ? <p>You</p> : ""}
        <div></div>
      </div>
    );
  }
);

export default LocalVideo;
