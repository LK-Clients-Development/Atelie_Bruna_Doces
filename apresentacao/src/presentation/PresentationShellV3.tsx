import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { V3_CLOSING_INDEX, V3_EXPANSION_START, V3_MAIN_COUNT, V3_SLIDES, EXPANSION_LABEL } from './content-v3';
import SlideNavigation from './components/SlideNavigation';
import SlideProgress from './components/SlideProgress';
import { useFullscreen } from './hooks';

import LkIntroScene from './scenes/v3/LkIntroScene';
import AtelieScene from './scenes/v3/AtelieScene';
import BrandScene from './scenes/v3/BrandScene';
import DemoScene from './scenes/v3/DemoScene';
import ProposalScene from './scenes/v3/ProposalScene';
import ClosingSceneV3 from './scenes/v3/ClosingSceneV3';
import EssentialOverviewScene from './scenes/v3/expansion/EssentialOverviewScene';
import EssentialHowScene from './scenes/v3/expansion/EssentialHowScene';
import IntegratedOverviewScene from './scenes/v3/expansion/IntegratedOverviewScene';
import IntegratedExploreScene from './scenes/v3/expansion/IntegratedExploreScene';
import './styles/v3-expansion.css';

const SWIPE_THRESHOLD = 48;
const TOTAL = V3_SLIDES.length;
const MAIN_LABELS = V3_SLIDES.filter((s) => s.group === 'main').map((s) => s.kicker);
const EXPANSION_LABELS = V3_SLIDES.filter((s) => s.group === 'expansion').map((s) => s.kicker);
const EXPANSION_COUNT = TOTAL - V3_MAIN_COUNT;

/**
 * Apresentação V3 (6 slides + expansão comercial opcional de 4 etapas visuais: 07A, 07B, 08A, 08B).
 * - Sequência padrão: 01 → 06. "Próximo" no 06 NÃO entra na expansão.
 * - A expansão (07, 08) só abre pelo botão discreto do encerramento; a primeira etapa da expansão, em "anterior", volta ao 06. A última (08B) não avança.
 */
export default function PresentationShellV3() {
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggle, supported } = useFullscreen(stageRef);
  const touchStart = useRef<number | null>(null);
  const locked = useRef(false);

  const inExpansion = index >= V3_EXPANSION_START;
  const canNext = index !== V3_CLOSING_INDEX && index < TOTAL - 1;
  const canPrev = index > 0;

  const goTo = useCallback((n: number) => setIndex(Math.max(0, Math.min(TOTAL - 1, n))), []);
  const openExpansion = useCallback(() => setIndex(V3_EXPANSION_START), []);
  const backToClosing = useCallback(() => setIndex(V3_CLOSING_INDEX), []);
  const nextStep = useCallback(() => setIndex((i) => Math.min(TOTAL - 1, i + 1)), []);
  const restartExpansion = useCallback(() => setIndex(V3_EXPANSION_START), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (locked.current) return;
      locked.current = true;
      setTimeout(() => (locked.current = false), 120);
      setIndex((i) => {
        if (dir === 1) return i === V3_CLOSING_INDEX || i >= TOTAL - 1 ? i : i + 1;
        return Math.max(0, i - 1); // 07 → 06 volta ao encerramento sem reiniciar
      });
    },
    [],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      const interactive = target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, [contenteditable="true"]'));
      if (event.key === ' ' && interactive) return;
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      } else if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen().catch(() => undefined);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const delta = (e.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    touchStart.current = null;
    if (delta <= -SWIPE_THRESHOLD) step(1);
    else if (delta >= SWIPE_THRESHOLD) step(-1);
  };

  const scenes = [
    (a: boolean) => <LkIntroScene active={a} />,
    (a: boolean) => <DemoScene active={a} />,
    (a: boolean) => <AtelieScene active={a} />,
    (a: boolean) => <BrandScene active={a} />,
    (a: boolean) => <ProposalScene active={a} />,
    (a: boolean) => <ClosingSceneV3 active={a} onOpenExpansion={openExpansion} />,
    (a: boolean) => <EssentialOverviewScene active={a} onNext={nextStep} />,
    (a: boolean) => <EssentialHowScene active={a} onNext={nextStep} />,
    (a: boolean) => <IntegratedOverviewScene active={a} onNext={nextStep} />,
    (a: boolean) => <IntegratedExploreScene active={a} />,
  ];

  return (
    <div
      className={`shell shell--v3 ${inExpansion ? 'shell--expansion' : ''}`}
      ref={stageRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-version="3"
    >
      <div className="shell__track" style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}>
        {scenes.map((render, i) => (
          <section
            key={V3_SLIDES[i].id}
            className="shell__scene"
            aria-hidden={i !== index}
            data-scene={V3_SLIDES[i].id}
            {...(i !== index ? ({ inert: '' } as Record<string, string>) : {})}
          >
            {render(i === index)}
          </section>
        ))}
      </div>

      <header className="shell__topbar">
        <p className="shell__brand">Ateliê Doces Bruna</p>
        <p className="shell__agency">{inExpansion ? EXPANSION_LABEL : 'LK Technologies Brasil'}</p>
      </header>

      <footer className="shell__footer">
        {inExpansion ? (
          <div className="shell__expansion-nav">
            <button type="button" className="shell__back" onClick={backToClosing}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Voltar ao encerramento</span>
            </button>
            <SlideProgress
              total={EXPANSION_COUNT}
              current={index - V3_EXPANSION_START}
              onSelect={(i) => goTo(V3_EXPANSION_START + i)}
              labels={EXPANSION_LABELS}
              groupLabel="Progresso da expansão comercial"
              itemLabel="slide de expansão"
              countText={`${EXPANSION_LABEL} · ${index - V3_EXPANSION_START + 1}/${EXPANSION_COUNT}`}
            />
          </div>
        ) : (
          <SlideProgress total={V3_MAIN_COUNT} current={index} onSelect={goTo} labels={MAIN_LABELS} />
        )}
        <SlideNavigation
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onRestart={inExpansion ? restartExpansion : () => goTo(0)}
          restartLabel={inExpansion ? 'Reiniciar a expansão comercial' : undefined}
          onToggleFullscreen={toggle}
          isFullscreen={isFullscreen}
          fullscreenSupported={supported}
          canPrev={canPrev}
          canNext={canNext}
        />
      </footer>
    </div>
  );
}
