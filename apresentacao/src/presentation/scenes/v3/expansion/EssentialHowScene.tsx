import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ESSENTIAL_B as C } from '../../../content-v3-expansion';
import SplitText from '../../../components/SplitText';
import Reveal from '../../../components/Reveal';
import { HBars, MiniBars, XpButton, XpEyebrow, type XpSceneProps } from './parts';

type ModuleId = (typeof C.modules)[number]['id'];
interface Move {
  kind: string;
  delta: number;
}

function StockDemo() {
  const [modeId, setModeId] = useState<'ready' | 'ingredient'>('ready');
  const [balances, setBalances] = useState<Record<string, number>>({ ready: 24, ingredient: 18 });
  const [moves, setMoves] = useState<Record<string, Move[]>>({ ready: [], ingredient: [] });
  const mode = C.stock.modes.find((m) => m.id === modeId)!;
  const balance = balances[modeId];

  const apply = (kind: string, delta: number) => {
    setBalances((b) => ({ ...b, [modeId]: Math.max(0, b[modeId] + delta) }));
    setMoves((m) => ({ ...m, [modeId]: [{ kind, delta }, ...m[modeId]].slice(0, 4) }));
  };
  const reset = () => {
    setBalances({ ready: C.stock.modes[0].start, ingredient: C.stock.modes[1].start });
    setMoves({ ready: [], ingredient: [] });
  };

  return (
    <div className="xp-demo xp-demo--stock">
      <div className="xp-seg" role="group" aria-label="Tipo de estoque">
        {C.stock.modes.map((m) => (
          <button key={m.id} type="button" className={`xp-seg__btn ${m.id === modeId ? 'is-on' : ''}`} aria-pressed={m.id === modeId} onClick={() => setModeId(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="xp-stock">
        <div>
          <p className="xp-stock__item">{mode.item}</p>
          <p className="xp-stock__qty" aria-live="polite">
            <span key={`${modeId}-${balance}`} className="xp-pop">
              {balance}
            </span>
            <small>{mode.unit}</small>
          </p>
        </div>
        <div className="xp-stock__actions">
          {C.stock.actions.map((a) => (
            <button key={a.id} type="button" className="xp-chip" onClick={() => apply(a.kind, a.delta)}>
              {a.delta > 0 ? <Plus size={14} aria-hidden="true" /> : <Minus size={14} aria-hidden="true" />}
              {a.label}
            </button>
          ))}
          <button type="button" className="xp-link" onClick={reset}>
            {C.stock.reset}
          </button>
        </div>
      </div>
      <ul className="xp-log" role="list" aria-label="Histórico de movimentações (exemplo)">
        {moves[modeId].length === 0 && <li className="xp-log__empty">Nenhuma movimentação ainda. Experimente uma ação acima.</li>}
        {moves[modeId].map((m, i) => (
          <li key={`${i}-${m.kind}-${m.delta}`} className="xp-pop">
            <span>{m.kind}</span>
            <strong>{m.delta > 0 ? `+${m.delta}` : `−${Math.abs(m.delta)}`}</strong>
          </li>
        ))}
      </ul>
      <p className="xp__micro">{C.stock.modeNote}</p>
    </div>
  );
}

function SalesDemo() {
  const [qty, setQty] = useState<number>(C.sales.initialQty);
  const [recorded, setRecorded] = useState<number | null>(null);
  return (
    <div className="xp-demo xp-demo--sales">
      <dl className="xp-form">
        <div>
          <dt>Produto</dt>
          <dd>{C.sales.product}</dd>
        </div>
        <div>
          <dt>Quantidade</dt>
          <dd className="xp-stepper">
            <button type="button" aria-label="Diminuir quantidade" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <Minus size={14} aria-hidden="true" />
            </button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Aumentar quantidade" onClick={() => setQty((q) => q + 1)}>
              <Plus size={14} aria-hidden="true" />
            </button>
          </dd>
        </div>
        <div>
          <dt>Canal</dt>
          <dd>{C.sales.channel}</dd>
        </div>
        <div>
          <dt>Registro</dt>
          <dd>{C.sales.record}</dd>
        </div>
      </dl>
      <button type="button" className="xp-chip xp-chip--solid" onClick={() => setRecorded(qty)}>
        {C.sales.cta}
      </button>
      <p className="xp-confirm" aria-live="polite">
        {recorded !== null ? (
          <span key={recorded} className="xp-pop">
            Registrado (exemplo): {recorded} × {C.sales.product} · {C.sales.channel} · manual
          </span>
        ) : (
          ' '
        )}
      </p>
      <p className="xp__micro">{C.sales.disclaimer}</p>
    </div>
  );
}

function ReportsDemo() {
  const r = C.reports;
  return (
    <div className="xp-demo xp-demo--reports">
      <section className="xp-tile">
        <h4>{r.sales.title}</h4>
        <MiniBars values={r.sales.bars} label={`${r.sales.title}, gráfico de exemplo`} />
      </section>
      <section className="xp-tile">
        <h4>{r.top.title}</h4>
        <HBars rows={r.top.rows} />
      </section>
      <section className="xp-tile">
        <h4>{r.history.title}</h4>
        <ul className="xp-log xp-log--compact" role="list">
          {r.history.rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </section>
      <section className="xp-tile">
        <h4>{r.stock.title}</h4>
        <dl className="xp-kv">
          {r.stock.rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SiteDemo() {
  return (
    <div className="xp-demo xp-demo--site">
      <dl className="xp-metrics">
        {C.site.metrics.map((m) => (
          <div key={m.label}>
            <dd>{m.value}</dd>
            <dt>{m.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** 07B: miniambiente ilustrativo e navegável (estoque, vendas, relatórios e interesse no site). */
export default function EssentialHowScene({ active, onNext }: XpSceneProps) {
  const [moduleId, setModuleId] = useState<ModuleId>('estoque');
  const current = C.modules.find((m) => m.id === moduleId)!;

  return (
    <div className="scene scene--expansion">
      <div className="scene__inner xp xp--b">
        <div className="xp__intro">
          <Reveal active={active} order={0}>
            <XpEyebrow label={C.eyebrow} />
          </Reveal>
          <SplitText as="h2" className="display display--lg xp__title" lines={[...C.title]} active={active} />
          <Reveal active={active} order={2} className="xp-stack">
            <div className="xp-modules" role="group" aria-label="Módulos de exemplo">
              {C.modules.map((m) => (
                <button key={m.id} type="button" className={`xp-module ${m.id === moduleId ? 'is-on' : ''}`} aria-pressed={m.id === moduleId} onClick={() => setModuleId(m.id)}>
                  {m.label}
                </button>
              ))}
            </div>
            <p className="xp-explain" aria-live="polite">
              <span key={moduleId} className="xp-pop">
                {current.text}
              </span>
            </p>
          </Reveal>
          <Reveal active={active} order={3}>
            <XpButton onClick={onNext}>{C.cta}</XpButton>
          </Reveal>
        </div>

        <Reveal active={active} order={2} className="xp__stage">
          <div className="xp-window">
            <div className="xp-window__bar">
              <span className="xp-window__dots" aria-hidden="true" />
              <span className="xp-window__tag">{C.sample}</span>
            </div>
            <div key={moduleId} className="xp-window__body xp-fade">
              {moduleId === 'estoque' && <StockDemo />}
              {moduleId === 'vendas' && <SalesDemo />}
              {moduleId === 'relatorios' && <ReportsDemo />}
              {moduleId === 'site' && <SiteDemo />}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
