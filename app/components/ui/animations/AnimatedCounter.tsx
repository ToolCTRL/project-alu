import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

export default function AnimatedCounter({ value, duration = 500, className, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      setDisplay(Math.round(progress * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
