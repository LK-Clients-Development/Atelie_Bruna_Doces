import { useEffect, useState } from 'react';
import { INTEGRATED_A as C, XP_NOTE_CONCEPT } from '../../../content-v3-expansion';
import SplitText from '../../../components/SplitText';
import Reveal from '../../../components/Reveal';
import { usePrefersReducedMotion } from '../../../hooks';
import { XpButton, XpEyebrow, type XpSceneProps } from './parts';

/** 08A: mockup conceitual de plataforma + jornada animada do pedido (sem prometer sistema existente). */
export default function IntegratedOverviewScene({ active, onNext }: XpSceneProps) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  // A jornada avança sozinha enquanto o slide está ativo; em reduced-motion todas as etapas ficam visíveis.
  useEffect(() => {
    if (!active || reduced) {
      setStep(reduced ? C.flow.length - 1 : 0);
      return;
    }
    setStep(0);
    // avança 1 etapa por tick; ao concluir, segura o quadro completo por alguns ticks antes de recomeçar
    const id = window.setInterval(() => setStep((s) => (s + 1) % (C.flow.length + 4)), 1000);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  return (
    <div className="scene scene--expansion">
      <div className="scene__inner xp xp--c">
        <div className="xp__intro">
          <Reveal active={active} order={0}>
            <XpEyebrow label={C.eyebrow} option={C.option} />
          </Reveal>
          <SplitText as="h2" className="display display--lg xp__title" lines={[...C.title]} active={active} />
          <Reveal active={active} order={2}>
            <p className="lead">{C.subtitle}</p>
            <p className="xp__message">{C.message}</p>
          </Reveal>
          <Reveal active={active} order={3}>
            <XpButton onClick={onNext}>{C.cta}</XpButton>
          </Reveal>
        </div>

        <Reveal active={active} order={2} className="xp__stage">
          <div className="xp-app" role="img" aria-label="Conceito visual de uma plataforma de gestão, com menu lateral, indicadores e pedidos fictícios">
            <span className="xp-app__tag">{C.conceptTag}</span>
            <aside className="xp-app__side" aria-hidden="true">
              <span className="xp-app__logo" />
              {C.nav.map((n, i) => (
                <span key={n} className={`xp-app__nav ${i === 0 ? 'is-on' : ''}`}>
                  {n}
                </span>
              ))}
            </aside>
            <div className="xp-app__main" aria-hidden="true">
              <div className="xp-app__kpis">
                {C.kpis.map((k) => (
                  <div key={k.label} className="xp-app__kpi">
                    <strong>{k.value}</strong>
                    <span>{k.label}</span>
                  </div>
                ))}
              </div>
              <ul className="xp-app__orders">
                {C.orders.map((o) => (
                  <li key={o.id}>
                    <span>{o.id}</span>
                    <span>{o.name}</span>
                    <em>{o.status}</em>
                  </li>
                ))}
              </ul>
              <div className="xp-app__spark">
                {[40, 62, 48, 80, 66, 92, 74].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal active={active} order={4} className="xp-flow-wrap">
          <ol className="xp-flow" aria-label="Jornada do pedido na plataforma conceitual">
            {C.flow.map((f, i) => (
              <li key={f} className={`xp-flow__step ${i < step ? 'is-done' : ''} ${i === Math.min(step, C.flow.length) - 1 ? 'is-now' : ''}`}>
                <span className="xp-flow__dot" aria-hidden="true" />
                <span className="xp-flow__label">{f}</span>
              </li>
            ))}
          </ol>
          <p className="xp__note">{XP_NOTE_CONCEPT}</p>
        </Reveal>
      </div>
    </div>
  );
}
