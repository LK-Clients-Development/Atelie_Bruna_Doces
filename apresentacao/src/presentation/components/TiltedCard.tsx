import { useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks';

interface TiltedCardProps {
  className?: string;
  children: React.ReactNode;
}

/** "Tilted Card" do React Bits: leve inclinação 3D acompanhando o cursor. Discreta, sem efeito de jogo. */
export default function TiltedCard({ className, children }: TiltedCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || reduced || event.pointerType !== 'mouse') return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(node, { rotateY: px * 7, rotateX: py * -7, duration: 0.4, ease: 'power2.out', transformPerspective: 700 });
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    gsap.to(node, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
  };

  return (
    <div ref={ref} className={`tilted-card ${className ?? ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
