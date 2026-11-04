import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks';

interface CakeLayersProps {
  active: boolean;
  activeLayer: number;
  className?: string;
}

const LAYER_FILLS = ['var(--color-cacao-800)', 'var(--color-caramel-500)', 'var(--color-blush)'];

/**
 * Ilustração conceitual de um bolo em três camadas (não é foto de produto real). Cada camada
 * representa uma fase da proposta (ver content.ts → ROADMAP_PHASES) e se organiza em sequência,
 * de baixo para cima, conforme o convidado avança pelas fases.
 */
export default function CakeLayers({ active, activeLayer, className }: CakeLayersProps) {
  const rootRef = useRef<SVGSVGElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layers = [0, 1, 2].map((i) => root.querySelector<SVGGElement>(`[data-layer="${i}"]`)).filter((n): n is SVGGElement => Boolean(n));
    if (layers.length === 0) return;

    if (!active) {
      gsap.set(layers, { opacity: 0, y: 26 });
      return;
    }
    if (reduced) {
      gsap.set(layers, { opacity: 1, y: 0 });
    } else {
      gsap.fromTo(layers, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15, delay: 0.15 });
    }
  }, [active, reduced]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active) return;
    [0, 1, 2].forEach((i) => {
      const layer = root.querySelector<SVGGElement>(`[data-layer="${i}"]`);
      if (!layer) return;
      gsap.to(layer, { opacity: i === activeLayer ? 1 : 0.38, duration: 0.4, ease: 'power2.out' });
    });
  }, [active, activeLayer]);

  return (
    <svg ref={rootRef} className={className} width={220} height={210} viewBox="0 0 220 210" aria-hidden="true" focusable="false">
      <g data-layer="2">
        <rect x="52" y="20" width="116" height="42" rx="8" fill={LAYER_FILLS[2]} />
        <ellipse cx="110" cy="20" rx="58" ry="10" fill={LAYER_FILLS[2]} opacity="0.85" />
      </g>
      <g data-layer="1">
        <rect x="30" y="76" width="160" height="52" rx="9" fill={LAYER_FILLS[1]} />
        <ellipse cx="110" cy="76" rx="80" ry="11" fill={LAYER_FILLS[1]} opacity="0.85" />
      </g>
      <g data-layer="0">
        <rect x="8" y="142" width="204" height="60" rx="10" fill={LAYER_FILLS[0]} />
        <ellipse cx="110" cy="142" rx="102" ry="12" fill={LAYER_FILLS[0]} opacity="0.85" />
      </g>
    </svg>
  );
}
