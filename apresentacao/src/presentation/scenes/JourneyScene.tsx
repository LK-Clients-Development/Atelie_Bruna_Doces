import { ArrowRight } from 'lucide-react';
import type { SceneProps } from './types';
import { JOURNEY_NOTE, JOURNEY_STEPS, SCENES } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';

const copy = SCENES.journey;

export default function JourneyScene({ active }: SceneProps) {
  return (
    <div className="scene scene--journey">
      <div className="scene__inner journey">
        <div className="scene__head">
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
        </div>

        <ol className="journey__path" role="list">
          {JOURNEY_STEPS.map((step, i) => (
            <li key={step.step} className="journey__item">
              <Reveal active={active} order={i + 1} className="journey__card">
                <span className="journey__num">{String(step.step).padStart(2, '0')}</span>
                <p className="journey__label">{step.label}</p>
                <p className="journey__detail">{step.detail}</p>
              </Reveal>
              {i < JOURNEY_STEPS.length - 1 && (
                <span className="journey__arrow" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              )}
            </li>
          ))}
        </ol>

        <Reveal active={active} order={JOURNEY_STEPS.length + 1}>
          <p className="fine-print">{JOURNEY_NOTE}</p>
        </Reveal>
      </div>
    </div>
  );
}
