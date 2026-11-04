import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks';

interface AnimatedCounterProps {
  value: number;
  active: boolean;
  duration?: number;
  className?: string;
}

/** "Animated Counter" do React Bits: contagem crescente até o valor final, só quando a cena está ativa. */
export default function AnimatedCounter({ value, active, duration = 1.1, className }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const reduced = usePrefersReducedMotion();
  const proxy = useRef({ n: 0 });

  useEffect(() => {
    if (!active) {
      proxy.current.n = 0;
      setDisplay(0);
      return;
    }
    if (reduced) {
      setDisplay(value);
      return;
    }
    const obj = proxy.current;
    obj.n = 0;
    const tween = gsap.to(obj, {
      n: value,
      duration,
      ease: 'power2.out',
      delay: 0.25,
      onUpdate: () => setDisplay(Math.round(obj.n)),
    });
    return () => {
      tween.kill();
    };
  }, [active, duration, reduced, value]);

  return <span className={className}>{display}</span>;
}
