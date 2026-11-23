interface SlideProgressProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
  labels: string[];
  /** V3: rótulos próprios (ex.: expansão comercial, sem contador confuso). */
  groupLabel?: string;
  itemLabel?: string;
  countText?: string;
}

/** Indicador de progresso: pequenas pétalas (inspiradas na flor da marca), uma por cena. */
export default function SlideProgress({ total, current, onSelect, labels, groupLabel, itemLabel = 'cena', countText }: SlideProgressProps) {
  return (
    <nav className="progress" aria-label={groupLabel ?? 'Progresso da apresentação'}>
      <ol className="progress__list">
        {Array.from({ length: total }).map((_, i) => (
          <li key={i}>
            <button
              type="button"
              className={`progress__petal ${i === current ? 'is-active' : ''} ${i < current ? 'is-done' : ''}`}
              onClick={() => onSelect(i)}
              aria-current={i === current ? 'step' : undefined}
              aria-label={`Ir para ${itemLabel === 'cena' ? 'a' : 'o'} ${itemLabel} ${i + 1} de ${total}: ${labels[i]}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2c3 0 5 2.4 5 5.3 0 1.6-.7 3-1.8 4 1.4.6 2.8 1.8 2.8 3.9 0 2.9-2.4 5-5.4 5-1.1 0-2-.3-2.6-.8-.6.5-1.5.8-2.6.8-3 0-5.4-2.1-5.4-5 0-2.1 1.4-3.3 2.8-3.9C3.7 10.3 3 8.9 3 7.3 3 4.4 5 2 8 2c1.4 0 2.7.5 3.6 1.4C12.6 1.8 12 2 12 2Z" />
              </svg>
            </button>
          </li>
        ))}
      </ol>
      <p className="progress__count" aria-hidden="true">
        {countText ?? `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
      </p>
    </nav>
  );
}
