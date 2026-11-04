import { MessageCircle } from 'lucide-react';
import type { SceneProps } from './types';
import { AGENCY, LINKS, SCENES } from '../content';
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
          <FlowerMark animate={active} size={72} />
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--xl" lines={copy.title} active={active} />
          <Reveal active={active} order={2}>
            <p className="lead">{copy.subtitle}</p>
          </Reveal>
          <Reveal active={active} order={3} className="closing__actions">
            <a className="btn btn--pill" href={LINKS.whatsappProposta} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              <span>Conversar sobre o projeto</span>
            </a>
          </Reveal>
          <Reveal active={active} order={4}>
            <img className="closing__logo" src={logo} alt={AGENCY.name} />
            <p className="closing__signature">{AGENCY.line}</p>
          </Reveal>
        </div>
        <Reveal active={active} order={1} className="closing__media">
          <img src={ctaPhoto} alt="Composição de celebração do Ateliê Doces Bruna" loading="lazy" />
        </Reveal>
      </div>
    </div>
  );
}
