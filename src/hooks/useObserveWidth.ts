import { useEffect, useRef, useState } from 'react';

const useObserveWidth = () => {
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (elementRef.current) {
        const width = elementRef.current.offsetWidth;
        setWidth(width);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }
    updateWidth();
    return () => resizeObserver.disconnect();
  }, []);

  return [elementRef, width];
};

export default useObserveWidth;
