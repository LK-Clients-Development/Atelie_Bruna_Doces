import { useEffect, useState } from 'react';
import type { SceneProps } from './types';
import { ROADMAP_EXTRAS, ROADMAP_PHASES, SCENES } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import CakeLayers from '../components/CakeLayers';

const copy = SCENES.roadmap;
// camadas do bolo de baixo para cima; fases do roteiro na mesma ordem (fase 01 = base)
const LAYER_BY_PHASE_INDEX = [0, 1, 2];

export default function RoadmapScene({ active }: SceneProps) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!active) setSelected(0);
  }, [active]);

  return (
    <div className="scene scene--roadmap">
      <div className="scene__inner roadmap">
        <div className="scene__head">
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
          <Reveal active={active} order={1}>
            <p className="lead">{copy.subtitle}</p>
          </Reveal>
        </div>

        <div className="roadmap__body">
          <Reveal active={active} order={1} className="roadmap__cake">
            <CakeLayers active={active} activeLayer={LAYER_BY_PHASE_INDEX[selected]} />
          </Reveal>

          <ul className="roadmap__phases" role="list">
            {ROADMAP_PHASES.map((phase, i) => {
              const isActive = selected === i;
              return (
                <li key={phase.phase}>
                  <Reveal active={active} order={i + 2}>
                    <div className={`roadmap__phase roadmap__phase--${i === 0 ? 'first' : 'future'} ${isActive ? 'is-active' : ''}`}>
                      <button type="button" className="roadmap__phase-head" onClick={() => setSelected(i)} aria-expanded={isActive}>
                        <span className="roadmap__phase-num">{phase.phase}</span>
                        <span className="roadmap__phase-label">{phase.label}</span>
                        <span className="roadmap__badge">{phase.badge}</span>
                      </button>
                      {isActive && (
                        <div className="roadmap__detail">
                          <ul className="roadmap__items" role="list">
                            {phase.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          {'caveat' in phase && phase.caveat && <p className="fine-print">{phase.caveat}</p>}
                        </div>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal active={active} order={5} className="extras">
          <div className="extras__group">
            <p className="extras__label">{ROADMAP_EXTRAS.seasonal.label}</p>
            <ul className="extras__chips" role="list">
              {ROADMAP_EXTRAS.seasonal.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="extras__group">
            <p className="extras__label">{ROADMAP_EXTRAS.optional.label}</p>
            <ul className="extras__chips" role="list">
              {ROADMAP_EXTRAS.optional.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="fine-print extras__note">
            {ROADMAP_EXTRAS.disclaimer} {ROADMAP_EXTRAS.expansion}
          </p>
        </Reveal>
      </div>
    </div>
  );
}
