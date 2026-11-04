import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks';

interface RevealProps {
  active: boolean;
  /** Ordem de entrada dentro da cena (stagger manual, para controlar o ritmo da narrativa). */
  order?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * "Animated Content / Fade Content" do React Bits, adaptado: fade + leve deslocamento vertical,
 * disparado quando a cena fica ativa (não por scroll — aqui não há rolagem de página).
 */
export default function Reveal({ active, order = 0, y = 18, className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!active) {
      gsap.set(node, { opacity: reduced ? 1 : 0, y: reduced ? 0 : y });
      return;
    }
    if (reduced) {
      gsap.set(node, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(node, { opacity: 0, y }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.12 + order * 0.08 });
  }, [active, order, reduced, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
