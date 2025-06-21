import { useEffect, useRef, useState } from 'react';
const observeWidth = (Component) => {
  return function ObserveWidth(props) {
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

    return <Component ref={elementRef} width={width} {...props} />;
  };
};

export default observeWidth;
