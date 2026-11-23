import { ExternalLink } from 'lucide-react';
import type { SceneProps } from './types';
import { SCENES, SITE_URL } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import siteDesktop from '../../assets/site/site-desktop-1440.jpg';
import siteTablet from '../../assets/site/site-tablet-820.jpg';
import siteMobile from '../../assets/site/site-mobile-390.jpg';

const copy = SCENES.reveal;

/**
 * Três dispositivos físicos em CSS (notebook, tablet, smartphone), cada um exibindo a captura REAL do
 * site institucional no seu próprio viewport (1440×900, 820×1180, 390×844) — sem esticar nem reaproveitar.
 */
export interface RevealOverrides {
  kicker?: string;
  title?: readonly string[];
  /** Destino do botão (V3 usa o site local quando disponível). */
  siteUrl?: string;
  buttonLabel?: string;
  note?: string;
  highlights?: readonly string[];
}

export default function RevealScene({ active, kicker, title, siteUrl, buttonLabel, note, highlights }: SceneProps & RevealOverrides) {
  return (
    <div className="scene scene--reveal">
      <div className="scene__inner reveal">
        <div className="scene__head">
          <p className="kicker">{kicker ?? copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={title ? [...title] : copy.title} active={active} />
        </div>

        <div className="rig">
          <Reveal active={active} order={1} className="rig__item rig__item--laptop">
            <div className="laptop">
              <div className="laptop__lid">
                <div className="laptop__screen">
                  <img
                    src={siteDesktop}
                    width={1440}
                    height={900}
                    alt="Captura real do site do Ateliê Doces Bruna no computador: bolo de chocolate e a frase “Mais que doces, momentos inesquecíveis”"
                  />
                  <span className="laptop__notch" aria-hidden="true">
                    <i />
                  </span>
                </div>
              </div>
              <div className="laptop__hinge" aria-hidden="true" />
              <div className="laptop__base" aria-hidden="true">
                <span className="laptop__scoop" />
              </div>
              <div className="laptop__feet" aria-hidden="true">
                <span />
                <span />
              </div>
            </div>
          </Reveal>

          <Reveal active={active} order={2} className="rig__item rig__item--tablet">
            <div className="tablet">
              <span className="dev-btn tablet__btn tablet__btn--power" aria-hidden="true" />
              <span className="dev-btn tablet__btn tablet__btn--vol" aria-hidden="true" />
              <div className="tablet__bezel">
                <span className="tablet__cam" aria-hidden="true" />
                <div className="tablet__screen">
                  <img
                    src={siteTablet}
                    width={820}
                    height={1180}
                    alt="Captura real do site do Ateliê Doces Bruna no tablet, com a frase de abertura e o botão Conheça nossa história"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal active={active} order={3} className="rig__item rig__item--phone">
            <div className="phone">
              <span className="dev-btn phone__btn phone__btn--action" aria-hidden="true" />
              <span className="dev-btn phone__btn phone__btn--volup" aria-hidden="true" />
              <span className="dev-btn phone__btn phone__btn--voldown" aria-hidden="true" />
              <span className="dev-btn phone__btn phone__btn--power" aria-hidden="true" />
              <div className="phone__bezel">
                <div className="phone__screen">
                  <span className="phone__island" aria-hidden="true">
                    <i />
                  </span>
                  <img
                    src={siteMobile}
                    width={390}
                    height={844}
                    alt="Captura real do site do Ateliê Doces Bruna no celular, com a mesma frase de abertura e o botão Encomendar"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal active={active} order={4} className="reveal__cta">
          {highlights && (
            <ul className="reveal__highlights" role="list">
              {highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <a className="btn btn--pill" href={siteUrl ?? SITE_URL} target="_blank" rel="noopener noreferrer">
            <span>{buttonLabel ?? 'Explorar o site'}</span>
            <ExternalLink size={18} aria-hidden="true" />
          </a>
          <p className="fine-print">{note ?? 'Capturas reais do site institucional publicado.'}</p>
        </Reveal>
      </div>
    </div>
  );
}
