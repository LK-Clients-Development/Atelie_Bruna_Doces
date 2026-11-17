import { ClipboardList, Globe, Workflow, type LucideIcon } from 'lucide-react';
import type { SceneProps } from './types';
import { ANALYTICS_LEVELS, ANALYTICS_NOTE, ANALYTICS_QUESTION, SCENES } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';

const copy = SCENES.analytics;

const ICONS: Record<(typeof ANALYTICS_LEVELS)[number]['id'], LucideIcon> = {
  a: Globe,
  b: ClipboardList,
  c: Workflow,
};

export default function AnalyticsScene({ active }: SceneProps) {
  return (
    <div className="scene scene--analytics">
      <div className="scene__inner analytics">
        <div className="scene__head">
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
        </div>

        <ul className="levels" role="list">
          {ANALYTICS_LEVELS.map((level, i) => {
            const Icon = ICONS[level.id];
            return (
              <li key={level.id}>
                <Reveal active={active} order={i + 1} className={`level level--${level.id}`}>
                  <p className="level__tag">
                    <Icon size={16} aria-hidden="true" /> {level.tag}
                  </p>
                  <p className="level__label">{level.label}</p>
                  <ul className="level__items" role="list">
                    {level.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="level__status">{level.status}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal active={active} order={4} className="analytics__question">
          <p className="display display--md">“{ANALYTICS_QUESTION}”</p>
        </Reveal>

        <Reveal active={active} order={5}>
          <p className="fine-print">{ANALYTICS_NOTE}</p>
        </Reveal>
      </div>
    </div>
  );
}
