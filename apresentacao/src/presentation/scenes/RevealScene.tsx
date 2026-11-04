import { ExternalLink } from 'lucide-react';
import type { SceneProps } from './types';
import { SCENES, SITE_URL } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import bolo from '../../assets/photos/bolo-hero.webp';
import fatia from '../../assets/photos/fatia-chocolatuda.webp';
import logo from '../../assets/brand/atelie-doces-bruna-logo.png';

const copy = SCENES.reveal;

export default function RevealScene({ active }: SceneProps) {
  return (
    <div className="scene scene--reveal">
      <div className="scene__inner reveal">
        <div className="scene__head">
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
        </div>

        <div className="reveal__devices">
          <Reveal active={active} order={1} className="device device--desktop">
            <div className="device__frame">
              <div className="device__bar">
                <span />
                <span />
                <span />
              </div>
              <div className="device__screen">
                <img className="device__logo" src={logo} alt="" />
                <p className="device__hero-eyebrow">Nossas criações</p>
                <p className="device__hero-title">
                  Tem sempre algo
                  <br />
                  para <em>a sua vontade.</em>
                </p>
                <img className="device__hero-photo" src={bolo} alt="Prévia do site institucional: hero com bolo de cenoura" />
              </div>
            </div>
          </Reveal>

          <Reveal active={active} order={2} className="device device--mobile">
            <div className="device__frame device__frame--mobile">
              <div className="device__notch" />
              <div className="device__screen device__screen--mobile">
                <img className="device__hero-photo device__hero-photo--mobile" src={fatia} alt="Prévia do site em celular: galeria de criações" />
                <p className="device__hero-eyebrow">Galeria</p>
                <p className="device__hero-title device__hero-title--mobile">O álbum do Ateliê</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal active={active} order={3} className="reveal__cta">
          {SITE_URL ? (
            <a className="btn btn--pill" href={SITE_URL} target="_blank" rel="noopener noreferrer">
              <span>Explorar o site</span>
              <ExternalLink size={18} aria-hidden="true" />
            </a>
          ) : (
            <p className="fine-print">A demonstração ao vivo entra aqui assim que o domínio estiver publicado.</p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
