import { useEffect, useRef, useState, type RefObject } from "react";

const useObserveHeight = (): [RefObject<HTMLDivElement | null>, number] => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

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
