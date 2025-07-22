import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const SpinnerIcon = () => {
  return (
    <FaSpinner
      className="absolute top-1/2 left-1/2 text-4xl text-white -translate-x-1/2 -translate-y-1/2 z-10 animate-spin"
    />
  );
};

export default SpinnerIcon;
