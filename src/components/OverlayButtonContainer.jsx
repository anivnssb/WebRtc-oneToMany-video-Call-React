import React, { forwardRef, useEffect } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import observeWidth from './observeWidth';
import { FaThumbtackSlash } from 'react-icons/fa6';

const OverlayButtonContainer = (
  { hangupRemote, index, pinnedClient, streamId, width },
  forwardedRefFromParrent
) => {
  return (
    <div className="overlay-button-container" ref={forwardedRefFromParrent}>
      <button
        onClick={() => {
          hangupRemote(index);
        }}
        className="hangup-button"
        style={{ padding: width * 0.05 }}
      >
        <ImPhoneHangUp color="white" size={width * 0.1} />
      </button>
      <button
        onClick={() => {}}
        className="pin-button"
        style={{ padding: width * 0.05 }}
      >
        {pinnedClient !== streamId ? (
          <FaThumbtack color="rgb(50, 50, 50)" size={width * 0.1} />
        ) : (
          <FaThumbtackSlash color="rgb(50, 50, 50)" size={width * 0.1} />
        )}
      </button>
    </div>
  );
};

export default observeWidth(forwardRef(OverlayButtonContainer));
