import { Check } from 'lucide-react';
import type { SceneProps } from '../types';
import { BRAND_PRESENCE } from '../../content-v3';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';
import FlowerMark from '../../components/FlowerMark';
import fatia from '../../../assets/photos/fatia-chocolatuda.webp';
import siteMobile from '../../../assets/site/site-mobile-390.jpg';

/** Slide 04: valorizar, organizar e fortalecer a marca existente (sem propor nova logomarca). */
export default function BrandScene({ active }: SceneProps) {
  return (
    <div className="scene scene--brand">
      <div className="scene__inner brand">
        <div className="brand__text">
          <p className="kicker">{BRAND_PRESENCE.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={[...BRAND_PRESENCE.title]} active={active} />
          <Reveal active={active} order={2}>
            <blockquote className="brand__quote">
              <FlowerMark animate={active} size={34} />
              <p>
                {BRAND_PRESENCE.quote[0]}
                <br />
                {BRAND_PRESENCE.quote[1]}
              </p>
            </blockquote>
          </Reveal>
          <Reveal active={active} order={3}>
            <ul className="brand__points" role="list">
              {BRAND_PRESENCE.points.map((p) => (
                <li key={p.id}>
                  <Check size={16} aria-hidden="true" />
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
            <p className="fine-print">{BRAND_PRESENCE.approach}</p>
          </Reveal>
        </div>
        <Reveal active={active} order={1} className="brand__media">
          <img className="brand__photo" src={fatia} alt="Fatia de bolo de chocolate do Ateliê Doces Bruna" loading="lazy" />
          <div className="brand__phone">
            <img src={siteMobile} width={390} height={844} alt="O site do Ateliê no celular" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
