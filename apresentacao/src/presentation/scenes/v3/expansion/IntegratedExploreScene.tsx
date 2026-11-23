import { useState } from 'react';
import { INTEGRATED_B as C } from '../../../content-v3-expansion';
import SplitText from '../../../components/SplitText';
import Reveal from '../../../components/Reveal';
import { HBars, MiniBars, XpEyebrow, type XpSceneProps } from './parts';

type ModuleId = (typeof C.modules)[number]['id'];

function OrdersDemo() {
  const [stages, setStages] = useState<number[]>(C.orders.map((o) => o.stage));
  const last = C.orderStages.length - 1;
  return (
    <ul className="xp-orders" role="list">
      {C.orders.map((o, i) => (
        <li key={o.id} className="xp-orders__row">
          <div>
            <strong>{o.id}</strong> <span>{o.name}</span>
            <p>{o.item}</p>
          </div>
          <span key={stages[i]} className={`xp-status xp-status--${stages[i]} xp-pop`}>
            {C.orderStages[stages[i]]}
          </span>
          <button
            type="button"
            className="xp-chip"
            disabled={stages[i] >= last}
            aria-label={`Avançar o pedido ${o.id}`}
            onClick={() => setStages((s) => s.map((v, k) => (k === i ? Math.min(last, v + 1) : v)))}
          >
            Avançar
          </button>
        </li>
      ))}
    </ul>
  );
}

function CustomersDemo() {
  const c = C.customer;
  return (
    <div className="xp-customer">
      <span className="xp-customer__avatar" aria-hidden="true">
        {c.initials}
      </span>
      <div>
        <p className="xp-customer__name">{c.name}</p>
        <p className="xp__micro">{c.since}</p>
        <ul className="xp-log xp-log--compact" role="list">
          {c.purchases.map((p) => (
            <li key={p.id}>
              <span>
                {p.id} · {p.item}
              </span>
              <strong>{p.when}</strong>
            </li>
          ))}
        </ul>
        <p className="xp-customer__fav">{c.favorite}</p>
      </div>
    </div>
  );
}

function StockDemo() {
  const s = C.stock;
  return (
    <div className="xp-stock">
      <div>
        <p className="xp-stock__item">{s.item}</p>
        <p className="xp-stock__qty">
          <span>{s.qty}</span>
          <small>{s.unit}</small>
        </p>
      </div>
      <ul className="xp-log xp-log--compact" role="list" aria-label="Movimentações de exemplo">
        {s.moves.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

function OperationDemo() {
  const [at, setAt] = useState(0);
  return (
    <div className="xp-operation">
      <ol className="xp-track" aria-label="Etapas da operação">
        {C.operation.map((o, i) => (
          <li key={o} className={`${i <= at ? 'is-done' : ''} ${i === at ? 'is-now' : ''}`}>
            <span aria-hidden="true" />
            {o}
          </li>
        ))}
      </ol>
      <button type="button" className="xp-chip xp-chip--solid" onClick={() => setAt((a) => (a + 1) % C.operation.length)}>
        Avançar etapa (exemplo)
      </button>
    </div>
  );
}

function Demo({ id }: { id: ModuleId }) {
  switch (id) {
    case 'pedidos':
      return <OrdersDemo />;
    case 'clientes':
      return <CustomersDemo />;
    case 'estoque':
      return <StockDemo />;
    case 'vendas':
      return (
        <div>
          <p className="xp__micro">{C.sales.title}</p>
          <MiniBars values={C.sales.bars} labels={C.sales.days} label={`${C.sales.title}, gráfico de exemplo`} />
        </div>
      );
    case 'operacao':
      return <OperationDemo />;
    case 'relatorios':
      return (
        <div>
          <p className="xp__micro">{C.reports.title}</p>
          <HBars rows={C.reports.rows} suffix="%" />
        </div>
      );
  }
}

/** 08B: demonstração conceitual interativa, módulo a módulo. Última etapa: não avança para nada. */
export default function IntegratedExploreScene({ active }: XpSceneProps) {
  const [moduleId, setModuleId] = useState<ModuleId>('pedidos');
  const current = C.modules.find((m) => m.id === moduleId)!;

  return (
    <div className="scene scene--expansion">
      <div className="scene__inner xp xp--d">
        <div className="xp__intro">
          <Reveal active={active} order={0}>
            <XpEyebrow label={C.eyebrow} />
          </Reveal>
          <SplitText as="h2" className="display display--lg xp__title" lines={[...C.title]} active={active} />
          <Reveal active={active} order={2}>
            <div className="xp-list" role="group" aria-label="Módulos da plataforma conceitual">
              {C.modules.map((m) => (
                <button key={m.id} type="button" className={`xp-list__item ${m.id === moduleId ? 'is-on' : ''}`} aria-pressed={m.id === moduleId} onClick={() => setModuleId(m.id)}>
                  <span aria-hidden="true">{m.n}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal active={active} order={2} className="xp__stage">
          <div className="xp-window">
            <div className="xp-window__bar">
              <span className="xp-window__dots" aria-hidden="true" />
              <span className="xp-window__tag">{C.sample}</span>
            </div>
            <div key={moduleId} className="xp-window__body xp-fade">
              <h3 className="xp-window__title">{current.label}</h3>
              <p className="xp-explain" aria-live="polite">
                {current.text}
              </p>
              <Demo id={moduleId} />
            </div>
          </div>
          <p className="xp__note">{C.note}</p>
        </Reveal>
      </div>
    </div>
  );
}
