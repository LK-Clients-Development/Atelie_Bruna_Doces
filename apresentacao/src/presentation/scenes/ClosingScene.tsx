import { LINKS, AGENCY, CLOSING, SCENES } from '../content';
import type { SceneProps } from './types';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import FlowerMark from '../components/FlowerMark';
import Particles from '../components/Particles';
import ctaPhoto from '../../assets/photos/cta-celebracao.webp';
import logo from '../../assets/brand/atelie-doces-bruna-logo.png';

const copy = SCENES.closing;

export default function ClosingScene({ active }: SceneProps) {
  return (
    <div className="scene scene--closing">
      <Particles active={active} count={10} />
      <div className="scene__inner closing">
        <div className="closing__text">
          <FlowerMark animate={active} size={64} />
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--xl" lines={copy.title} active={active} />
          <Reveal active={active} order={2}>
            <p className="lead">{copy.subtitle}</p>
          </Reveal>

          <Reveal active={active} order={3} className="closing__delivery">
            <p className="closing__delivery-label">{CLOSING.deliveryLabel}</p>
            <ul className="closing__delivery-list" role="list">
              {CLOSING.delivery.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal active={active} order={4} className="closing__actions">
            <ol className="closing__steps" role="list">
              {CLOSING.steps.map((step, i) => (
                <li key={step}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {step}
                </li>
              ))}
            </ol>
            {LINKS.lkContact && (
              <a className="btn btn--pill" href={LINKS.lkContact} target="_blank" rel="noopener noreferrer">
                <span>Conversar sobre o projeto</span>
              </a>
            )}
            <p className="fine-print">{CLOSING.caveat}</p>
          </Reveal>

          <Reveal active={active} order={5}>
            <p className="closing__signature">{AGENCY.line}</p>
          </Reveal>
        </div>
        <Reveal active={active} order={1} className="closing__media">
          <img src={ctaPhoto} alt="Composição de celebração do Ateliê Doces Bruna" loading="lazy" />
          <img className="closing__logo" src={logo} alt="Ateliê Doces Bruna" />
        </Reveal>
      </div>
    </div>
  );
}
