import { useEffect, useRef, useState } from 'react';

const useObserveHeight = () => {
  const elementRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (elementRef.current) {
        const height = elementRef.current.offsetHeight;
        setHeight(height);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }
    updateWidth();
    return () => resizeObserver.disconnect();
  }, []);

  return [elementRef, height];
};

export default useObserveHeight;
