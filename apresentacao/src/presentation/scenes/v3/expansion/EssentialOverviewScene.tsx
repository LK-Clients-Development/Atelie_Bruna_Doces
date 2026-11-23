import { BarChart3, Boxes, ClipboardList, type LucideIcon } from 'lucide-react';
import { ESSENTIAL_A as C } from '../../../content-v3-expansion';
import { EXPANSION_DISCLAIMER } from '../../../content-v3';
import SplitText from '../../../components/SplitText';
import Reveal from '../../../components/Reveal';
import { XpButton, XpEyebrow, type XpSceneProps } from './parts';

const ICONS: Record<string, LucideIcon> = { estoque: Boxes, vendas: ClipboardList, visao: BarChart3 };

/** 07A: o Yooga continua; a Gestão Essencial LK é um ambiente complementar e independente. */
export default function EssentialOverviewScene({ active, onNext }: XpSceneProps) {
  return (
    <div className="scene scene--expansion">
      <div className="scene__inner xp xp--a">
        <div className="xp__intro">
          <Reveal active={active} order={0}>
            <XpEyebrow label={C.eyebrow} option={C.option} />
          </Reveal>
          <SplitText as="h2" className="display display--lg xp__title" lines={[...C.title]} active={active} />
          <Reveal active={active} order={2}>
            <p className="lead">{C.lead}</p>
          </Reveal>
          <Reveal active={active} order={3}>
            <XpButton onClick={onNext}>{C.cta}</XpButton>
          </Reveal>
        </div>

        <div className="xp__stage">
          <Reveal active={active} order={2} className="xp-split">
            <div className="xp-env xp-env--yooga">
              <p className="xp-env__label">{C.yooga.label}</p>
              <p className="xp-env__line">{C.yooga.line}</p>
            </div>
            <div className="xp-split__gap" aria-hidden="true">
              <span />
            </div>
            <div className="xp-env xp-env--lk">
              <p className="xp-env__label">{C.lk.label}</p>
              <p className="xp-env__line">{C.lk.line}</p>
            </div>
            <p className="xp-split__caption">{C.independent}</p>
          </Reveal>

          <Reveal active={active} order={4} className="xp-concepts">
            {C.concepts.map((c) => {
              const Icon = ICONS[c.id];
              return (
                <article key={c.id} className="xp-concept">
                  <span className="xp-concept__n" aria-hidden="true">
                    {c.n}
                  </span>
                  <Icon size={22} aria-hidden="true" />
                  <h3 className="xp-concept__title">{c.title}</h3>
                  <p className="xp-concept__text">{c.text}</p>
                </article>
              );
            })}
          </Reveal>
          <p className="xp__note">{EXPANSION_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
}
