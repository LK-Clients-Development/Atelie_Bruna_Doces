import type { SceneProps } from './types';
import { CATALOG_SURVEY, SCENES } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import AnimatedCounter from '../components/AnimatedCounter';
import CupcakeMotion from '../components/CupcakeMotion';

const copy = SCENES.opportunity;

export default function OpportunityScene({ active }: SceneProps) {
  return (
    <div className="scene scene--opportunity">
      <div className="scene__inner opportunity">
        <div className="opportunity__text">
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
          <Reveal active={active} order={1}>
            <p className="lead">{copy.subtitle}</p>
          </Reveal>

          <Reveal active={active} order={2} className="opportunity__stats">
            <div className="stat">
              <p className="stat__number">
                <AnimatedCounter value={CATALOG_SURVEY.categories} active={active} />
              </p>
              <p className="stat__label">coleções mapeadas</p>
            </div>
            <div className="stat">
              <p className="stat__number">
                <AnimatedCounter value={CATALOG_SURVEY.products} active={active} duration={1.4} />
              </p>
              <p className="stat__label">criações no cardápio</p>
            </div>
          </Reveal>
          <Reveal active={active} order={3}>
            <p className="fine-print">{CATALOG_SURVEY.note}</p>
          </Reveal>
        </div>

        <div className="opportunity__visual">
          <CupcakeMotion active={active} className="opportunity__cupcake" />
          <Reveal active={active} order={4} className="chip-cloud">
            <ul className="chip-cloud__list" role="list">
              {CATALOG_SURVEY.sample.map((name) => (
                <li key={name} className="chip-cloud__chip">
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
