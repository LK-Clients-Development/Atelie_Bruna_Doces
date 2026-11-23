import type { V3SceneProps } from '../types';
import { CLOSING_V3 } from '../../content-v3';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';
import FlowerMark from '../../components/FlowerMark';
import Particles from '../../components/Particles';
import ctaPhoto from '../../../assets/photos/cta-celebracao.webp';
import logo from '../../../assets/brand/atelie-doces-bruna-logo.png';

/** Slide 06: mesma direção visual do encerramento aprovado; a logo agora fica ABAIXO da fotografia, em área própria. */
export default function ClosingSceneV3({ active, onOpenExpansion }: V3SceneProps) {
  return (
    <div className="scene scene--closing3">
      <Particles active={active} count={10} />
      <div className="scene__inner closing3">
        <div className="closing3__text">
          <FlowerMark animate={active} size={56} />
          <p className="kicker">{CLOSING_V3.kicker}</p>
          <SplitText as="h2" className="display display--xl closing3__title" lines={[...CLOSING_V3.title]} active={active} />
          <Reveal active={active} order={2}>
            <p className="lead">{CLOSING_V3.lead}</p>
          </Reveal>
          <Reveal active={active} order={3}>
            <ol className="closing__steps" role="list">
              {CLOSING_V3.steps.map((step, i) => (
                <li key={step}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {step}
                </li>
              ))}
            </ol>
            <p className="fine-print">{CLOSING_V3.caveat}</p>
          </Reveal>
          <Reveal active={active} order={4} className="closing3__foot">
            <p className="closing__signature">{CLOSING_V3.signature}</p>
            {onOpenExpansion && (
              <button type="button" className="closing3__more" onClick={onOpenExpansion}>
                {CLOSING_V3.moreLabel}
              </button>
            )}
          </Reveal>
        </div>
        <Reveal active={active} order={1} className="closing3__media">
          <img className="closing3__photo" src={ctaPhoto} alt="Composição de celebração do Ateliê Doces Bruna" loading="lazy" />
          <div className="closing3__brand">
            <img src={logo} alt="Ateliê Doces Bruna" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
