import { Instagram, Link2, ShoppingBag, MessageCircle, Store, MapPin, type LucideIcon } from 'lucide-react';
import type { SceneProps } from './types';
import { CHANNELS, SCENES } from '../content';
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

        <Reveal active={active} order={1} className="foundation__media">
          <img src={bruna} alt="Bruna, do Ateliê Doces Bruna" loading="lazy" />
          <p className="foundation__caption">Por trás de cada criação, a Bruna.</p>
        </Reveal>
      </div>
    </div>
  );
}
