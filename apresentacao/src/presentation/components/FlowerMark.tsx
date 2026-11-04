import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BRAND_FLOWER as F } from '../../assets/brand-flower';
import { usePrefersReducedMotion } from '../hooks';

interface FlowerMarkProps {
  animate: boolean;
  size?: number;
  className?: string;
}

/**
 * Flor da marca em vetor (mesmo traçado oficial usado na assinatura de abertura do site institucional,
 * ver src/components/BrandIntro.astro). As pétalas se desenham em sequência quando `animate` fica true.
 */
export default function FlowerMark({ animate, size = 120, className }: FlowerMarkProps) {
  const dotRef = useRef<SVGCircleElement | null>(null);
  const maskRefs = useRef<Array<SVGPathElement | null>>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const dot = dotRef.current;
    const masks = maskRefs.current.filter((m): m is SVGPathElement => Boolean(m));
    if (!dot || masks.length === 0) return;

    if (!animate) {
      gsap.set(dot, { opacity: 0, scale: 0.85, transformOrigin: 'center' });
      gsap.set(masks, { strokeDashoffset: 1 });
      return;
    }
    if (reduced) {
      gsap.set(dot, { opacity: 1, scale: 1 });
      gsap.set(masks, { strokeDashoffset: 0 });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(dot, { opacity: 0, scale: 0.85, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: 0.3 });
    tl.fromTo(
      masks,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.5, stagger: 0.07, ease: 'power2.inOut' },
      0.12,
    );
    return () => {
      tl.kill();
    };
  }, [animate, reduced]);

  const maskId = `flower-mask-${size}`;

  return (
    <svg className={className} width={size} height={size * (F.height / F.width)} viewBox={F.viewBox} aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={F.width} height={F.height}>
          {F.masks.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                maskRefs.current[i] = el;
              }}
              d={d}
              pathLength="1"
              style={{ stroke: '#fff', strokeWidth: 30, fill: 'none', strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}
        </mask>
      </defs>
      <circle ref={dotRef} cx={F.dot.cx} cy={F.dot.cy} r={F.dot.r} fill={F.color} />
      <path d={F.petals} fill={F.color} fillRule="evenodd" mask={`url(#${maskId})`} />
    </svg>
  );
}
