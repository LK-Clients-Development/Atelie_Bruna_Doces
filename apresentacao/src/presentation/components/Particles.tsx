import { usePrefersReducedMotion } from '../hooks';

interface ParticlesProps {
  active: boolean;
  count?: number;
  className?: string;
}

const PALETTE = ['var(--color-caramel-400)', 'var(--color-blush)', 'var(--color-cream-200)', 'var(--color-caramel-200)'];

/** Confeitos discretos: poucas partículas, cores da marca, flutuação lenta via CSS. Decorativo, aria-hidden. */
export default function Particles({ active, count = 7, className }: ParticlesProps) {
  const reduced = usePrefersReducedMotion();
  if (reduced || !active) return null;

  return (
    <div className={`particles ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const left = 6 + ((i * 97) % 88);
        const top = 8 + ((i * 53) % 80);
        const size = 4 + (i % 3) * 2;
        const delay = (i % 5) * 0.6;
        const duration = 6 + (i % 4);
        return (
          <span
            key={i}
            className="particles__dot"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: PALETTE[i % PALETTE.length],
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
