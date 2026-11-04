import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { SceneProps } from './types';
import { SCENES } from '../content';
import FlowerMark from '../components/FlowerMark';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import Particles from '../components/Particles';
import { usePrefersReducedMotion } from '../hooks';
import bolo from '../../assets/photos/bolo-hero.webp';
import logo from '../../assets/brand/atelie-doces-bruna-logo.png';

const copy = SCENES.opening;

export default function OpeningScene({ active }: SceneProps) {
  const photoRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = photoRef.current;
    if (!node) return;
    if (!active) {
      gsap.set(node, { clipPath: reduced ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' });
      return;
    }
    if (reduced) {
      gsap.set(node, { clipPath: 'inset(0% 0% 0% 0%)' });
      return;
    }
    gsap.fromTo(node, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', delay: 0.55 });
  }, [active, reduced]);

  return (
    <div className="scene scene--opening">
      <Particles active={active} count={8} />
      <div className="scene__inner opening">
        <div className="opening__text">
          <div className="opening__flower">
            <FlowerMark animate={active} size={88} />
          </div>
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h1" className="display display--xl opening__title" lines={copy.title} active={active} delay={0.35} />
          <Reveal active={active} order={3} className="opening__subtitle">
            <p className="lead">{copy.subtitle}</p>
          </Reveal>
        </div>
        <Reveal active={active} order={1} className="opening__media">
          <div className="opening__photo" ref={photoRef}>
            <img src={bolo} alt="Bolo de cenoura com cobertura de chocolate, uma das criações do Ateliê Doces Bruna" loading="eager" />
          </div>
          <img className="opening__logo" src={logo} alt="Ateliê Doces Bruna" />
        </Reveal>
      </div>
    </div>
  );
}
