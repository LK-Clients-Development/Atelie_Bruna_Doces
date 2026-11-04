import { useEffect, useState } from 'react';
import type { SceneProps } from './types';
import { ROADMAP_PHASES, SCENES } from '../content';
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
        </div>

        <div className="roadmap__body">
          <Reveal active={active} order={1} className="roadmap__cake">
            <CakeLayers active={active} activeLayer={LAYER_BY_PHASE_INDEX[selected]} />
          </Reveal>

          <ul className="roadmap__phases" role="list">
            {ROADMAP_PHASES.map((phase, i) => (
              <li key={phase.phase}>
                <Reveal active={active} order={i + 2}>
                  <button
                    type="button"
                    className={`roadmap__phase ${selected === i ? 'is-active' : ''}`}
                    onClick={() => setSelected(i)}
                    aria-pressed={selected === i}
                  >
                    <span className="roadmap__phase-num">{phase.phase}</span>
                    <span className="roadmap__phase-label">{phase.label}</span>
                    {selected === i && (
                      <ul className="roadmap__items" role="list">
                        {phase.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {selected === i && 'caveat' in phase && phase.caveat && <p className="fine-print">{phase.caveat}</p>}
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
