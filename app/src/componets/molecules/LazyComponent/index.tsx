"use client";

import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";

const LazyComponent: FC<PropsWithChildren> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return <div ref={ref}>{isVisible ? children : null}</div>;
};

export { LazyComponent };
