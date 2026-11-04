import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks';

interface SplitTextProps {
  /** Uma linha por string (quebra de linha editorial, não é quebra automática). */
  lines: string[];
  active: boolean;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
}

/**
 * Título revelado linha a linha (inspirado no "Split Text" do React Bits), adaptado à voz
 * editorial do Ateliê: máscara + translateY, sem glitch nem efeito tecnológico.
 */
export default function SplitText({ lines, active, as: Tag = 'h1', className, delay = 0 }: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const rows = node.querySelectorAll<HTMLElement>('[data-split-row]');
    if (!active) {
      gsap.set(rows, { opacity: reduced ? 1 : 0, y: reduced ? 0 : '0.5em' });
      return;
    }
    if (reduced) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      rows,
      { opacity: 0, y: '0.55em' },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay },
    );
  }, [active, reduced, delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-split-row className="split-row">
          <span className="split-row__in">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
