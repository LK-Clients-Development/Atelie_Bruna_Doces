import { ChevronLeft, ChevronRight, Maximize, Minimize, RotateCcw } from 'lucide-react';

interface SlideNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  canPrev: boolean;
  canNext: boolean;
  /** Rótulo acessível do botão de reiniciar (V3 usa outro dentro da expansão). */
  restartLabel?: string;
}

/** Controles discretos: setas, reiniciar e tela cheia. Sempre navegável, mesmo com animações desligadas. */
export default function SlideNavigation({
  onPrev,
  onNext,
  onRestart,
  onToggleFullscreen,
  isFullscreen,
  fullscreenSupported,
  canPrev,
  canNext,
  restartLabel = 'Reiniciar apresentação',
}: SlideNavigationProps) {
  return (
    <div className="nav-controls">
      <button type="button" className="nav-controls__btn" onClick={onRestart} aria-label={restartLabel}>
        <RotateCcw size={18} aria-hidden="true" />
      </button>
      <button type="button" className="nav-controls__btn" onClick={onPrev} disabled={!canPrev} aria-label="Cena anterior">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button type="button" className="nav-controls__btn" onClick={onNext} disabled={!canNext} aria-label="Próxima cena">
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      {fullscreenSupported && (
        <button
          type="button"
          className="nav-controls__btn"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
