import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks';

interface CupcakeMotionProps {
  active: boolean;
  className?: string;
}

/**
 * Ilustração editorial de um cupcake (vetor próprio, não é React Bits): entra pela lateral, o creme
 * "desenha" em espiral, um confeito pousa sobre a cobertura e, depois, flutua discretamente. Reage de
 * leve ao cursor (translateY). Deliberadamente sem rosto nem expressão: é ilustração, não personagem.
 */
export default function CupcakeMotion({ active, className }: CupcakeMotionProps) {
  const rootRef = useRef<SVGSVGElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const idleRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const liner = root.querySelector<SVGPathElement>('[data-cupcake-liner]');
    const cream = root.querySelector<SVGPathElement>('[data-cupcake-cream]');
    const confetti = root.querySelector<SVGCircleElement>('[data-cupcake-confetti]');
    if (!liner || !cream || !confetti) return;

    const creamLength = cream.getTotalLength();
    gsap.set(cream, { strokeDasharray: creamLength, strokeDashoffset: creamLength });

    if (!active) {
      gsap.set(root, { opacity: 0, x: -24 });
      gsap.set(confetti, { opacity: 0, y: -10, scale: 0.6, transformOrigin: 'center' });
      return;
    }

    if (reduced) {
      gsap.set(root, { opacity: 1, x: 0 });
      gsap.set(cream, { strokeDashoffset: 0 });
      gsap.set(confetti, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(root, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
    tl.to(cream, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.25');
    tl.fromTo(confetti, { opacity: 0, y: -14, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, '-=0.15');
    idleRef.current = gsap.to(root, { y: '+=6', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });

    return () => {
      tl.kill();
      idleRef.current?.kill();
    };
  }, [active, reduced]);

  return (
    <svg ref={rootRef} className={className} width={180} height={190} viewBox="0 0 180 190" aria-hidden="true" focusable="false">
      {/* forminha */}
      <path
        data-cupcake-liner
        d="M48 116 L58 182 Q90 190 122 182 L132 116 Z"
        fill="var(--color-caramel-500)"
        opacity="0.92"
      />
      <path d="M48 116 L132 116 L128 128 Q90 134 52 128 Z" fill="var(--color-caramel-400)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={54 + i * 11.5} y1={120} x2={58 + i * 10.4} y2={178} stroke="var(--color-cacao-900)" strokeOpacity={0.14} strokeWidth={1.2} />
      ))}

      {/* cobertura: espiral de creme */}
      <path
        data-cupcake-cream
        d="M90 118
           C 60 118, 46 100, 50 80
           C 54 58, 76 46, 96 50
           C 114 54, 122 70, 114 82
           C 108 90, 96 90, 92 82
           C 89 75, 95 70, 100 74
           M90 118
           C 120 118, 134 100, 130 80
           C 126 60, 108 48, 90 50"
        fill="none"
        stroke="var(--color-offwhite)"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* confeito que pousa */}
      <circle data-cupcake-confetti cx={90} cy={46} r={6.5} fill="var(--color-caramel-600)" />
    </svg>
  );
}
