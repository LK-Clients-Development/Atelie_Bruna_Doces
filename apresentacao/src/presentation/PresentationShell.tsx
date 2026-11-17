import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENE_ORDER, SCENES } from './content';
import SlideNavigation from './components/SlideNavigation';
import SlideProgress from './components/SlideProgress';
import { useFullscreen } from './hooks';

import OpeningScene from './scenes/OpeningScene';
import FoundationScene from './scenes/FoundationScene';
import OpportunityScene from './scenes/OpportunityScene';
import RevealScene from './scenes/RevealScene';
import JourneyScene from './scenes/JourneyScene';
import AnalyticsScene from './scenes/AnalyticsScene';
import RoadmapScene from './scenes/RoadmapScene';
import ClosingScene from './scenes/ClosingScene';

const SCENE_COMPONENTS = [OpeningScene, FoundationScene, OpportunityScene, RevealScene, JourneyScene, AnalyticsScene, RoadmapScene, ClosingScene];
const LABELS = SCENE_ORDER.map((id) => SCENES[id].kicker);
const TOTAL = SCENE_ORDER.length;
const SWIPE_THRESHOLD = 48;

export default function PresentationShell() {
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggle, supported } = useFullscreen(stageRef);
  const touchStart = useRef<number | null>(null);
  const transitioning = useRef(false);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, next));
    setIndex(clamped);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const restart = useCallback(() => goTo(0), [goTo]);

  // navegação não é bloqueada por animações em andamento: só um pequeno debounce evita pular 2 cenas no mesmo tick
  const guardedNext = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    next();
    setTimeout(() => {
      transitioning.current = false;
    }, 120);
  }, [next]);

  const guardedPrev = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    prev();
    setTimeout(() => {
      transitioning.current = false;
    }, 120);
  }, [prev]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      // Espaço/Enter em botões, links e campos pertencem ao elemento focado (ativá-lo), não à navegação.
      const target = event.target;
      const interactive = target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, [contenteditable="true"]'));
      if (event.key === ' ' && interactive) return;
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        guardedNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        guardedPrev();
      } else if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen().catch(() => undefined);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [guardedNext, guardedPrev]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    touchStart.current = null;
    if (delta <= -SWIPE_THRESHOLD) guardedNext();
    else if (delta >= SWIPE_THRESHOLD) guardedPrev();
  };

  return (
    <div className="shell" ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="shell__track" style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}>
        {SCENE_COMPONENTS.map((SceneComponent, i) => (
          <section
            key={SCENE_ORDER[i]}
            className="shell__scene"
            aria-hidden={i !== index}
            data-scene={SCENE_ORDER[i]}
            {...(i !== index ? ({ inert: '' } as Record<string, string>) : {})}
          >
            <SceneComponent active={i === index} />
          </section>
        ))}
      </div>

      <header className="shell__topbar">
        <p className="shell__brand">Ateliê Doces Bruna</p>
        <p className="shell__agency">LK Technologies Brasil</p>
      </header>

      <footer className="shell__footer">
        <SlideProgress total={TOTAL} current={index} onSelect={goTo} labels={LABELS} />
        <SlideNavigation
          onPrev={guardedPrev}
          onNext={guardedNext}
          onRestart={restart}
          onToggleFullscreen={toggle}
          isFullscreen={isFullscreen}
          fullscreenSupported={supported}
          canPrev={index > 0}
          canNext={index < TOTAL - 1}
        />
      </footer>
    </div>
  );
}
