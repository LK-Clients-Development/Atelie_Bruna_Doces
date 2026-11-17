import { Instagram, Link2, ShoppingBag, MessageCircle, Store, MapPin, type LucideIcon } from 'lucide-react';
import type { SceneProps } from './types';
import { CHANNELS, FOUNDATION_BRIDGE, REGIONAL_NEWS, SCENES } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import TiltedCard from '../components/TiltedCard';
import bruna from '../../assets/photos/bruna-retrato.webp';

const copy = SCENES.foundation;

const ICONS: Record<(typeof CHANNELS)[number]['id'], LucideIcon> = {
  instagram: Instagram,
  linktree: Link2,
  yooga: ShoppingBag,
  whatsapp: MessageCircle,
  loja: Store,
  maps: MapPin,
};

export default function FoundationScene({ active }: SceneProps) {
  return (
    <div className="scene scene--foundation">
      <div className="scene__inner foundation">
        <div className="foundation__col">
          <div className="scene__head">
            <p className="kicker">{copy.kicker}</p>
            <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
            <Reveal active={active} order={1}>
              <p className="lead">{copy.subtitle}</p>
            </Reveal>
          </div>

          <ul className="channel-grid" role="list">
            {CHANNELS.map((channel, i) => {
              const Icon = ICONS[channel.id];
              return (
                <li key={channel.id}>
                  <Reveal active={active} order={i + 2}>
                    <TiltedCard className="channel-card">
                      <Icon size={22} />
                      <p className="channel-card__label">{channel.label}</p>
                      <p className="channel-card__detail">{channel.detail}</p>
                      <p className="channel-card__note">{channel.note}</p>
                    </TiltedCard>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="foundation__side">
          <Reveal active={active} order={1} className="foundation__media">
            <img src={bruna} alt="Bruna, do Ateliê Doces Bruna" loading="lazy" />
            <p className="foundation__caption">Por trás de cada criação, a Bruna.</p>
          </Reveal>

          <Reveal active={active} order={8} className="bridge">
            <p className="bridge__text">{FOUNDATION_BRIDGE.text}</p>
            <p className="bridge__invite">{FOUNDATION_BRIDGE.invite}</p>
            <ul className="bridge__prompts" role="list">
              {FOUNDATION_BRIDGE.prompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal active={active} order={9} className="regional">
            <p className="regional__label">{REGIONAL_NEWS.label}</p>
            <ul className="regional__list" role="list">
              {REGIONAL_NEWS.cities.map((city) => (
                <li key={city.id}>
                  <MapPin size={16} aria-hidden="true" />
                  <span>
                    <strong>{city.name}</strong> — {city.text}.
                  </span>
                </li>
              ))}
            </ul>
            <p className="regional__note">{REGIONAL_NEWS.line}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
