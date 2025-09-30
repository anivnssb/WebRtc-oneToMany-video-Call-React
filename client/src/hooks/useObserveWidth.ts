import { useEffect, useRef, useState, type RefObject } from "react";

const useObserveWidth = (): [RefObject<HTMLDivElement | null>, number] => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);

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
