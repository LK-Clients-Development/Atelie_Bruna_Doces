import type { SceneProps } from '../types';
import { ATELIE_VIEW } from '../../content-v3';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';
import retrato from '../../../assets/photos/bruna-retrato.webp';
import bolo from '../../../assets/photos/bolo-hero.webp';

/** Slide 03: reconhecer o que a Bruna já construiu. Fotografia protagonista, texto enxuto. */
export default function AtelieScene({ active }: SceneProps) {
  return (
    <div className="scene scene--atelie">
      <div className="scene__inner atelie">
        <div className="atelie__text">
          <p className="kicker">{ATELIE_VIEW.kicker}</p>
          <SplitText as="h2" className="display display--lg atelie__title" lines={[...ATELIE_VIEW.title]} active={active} />
          <Reveal active={active} order={2}>
            <p className="lead">{ATELIE_VIEW.lead}</p>
          </Reveal>
          <Reveal active={active} order={3}>
            <ul className="atelie__items" role="list">
              {ATELIE_VIEW.items.map((item) => (
                <li key={item.id}>
                  <span className="atelie__item-label">{item.label}</span>
                  <span className="atelie__item-note">{item.note}</span>
                </li>
              ))}
            </ul>
            <p className="fine-print">{ATELIE_VIEW.caption}</p>
          </Reveal>
        </div>
        <Reveal active={active} order={1} className="atelie__media">
          <img className="atelie__photo atelie__photo--main" src={retrato} alt="Bruna, confeiteira do Ateliê Doces Bruna" loading="lazy" />
          <img className="atelie__photo atelie__photo--side" src={bolo} alt="Bolo de cenoura com cobertura de chocolate do Ateliê" loading="lazy" />
        </Reveal>
      </div>
    </div>
  );
}
