import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SceneProps } from '../types';
import { PROPOSAL } from '../../content-v3';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';

type PanelId = 'cost' | 'domain';

const PANEL_ID: Record<PanelId, string> = { cost: 'proposal-panel-cost', domain: 'proposal-panel-domain' };

/** Slide 05: proposta direta. Dois detalhamentos sob demanda (custo e domínio); só um fica aberto por vez. */
export default function ProposalScene({ active }: SceneProps) {
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const [planIndex, setPlanIndex] = useState(0);
  const { cost, domain } = PROPOSAL;
  const plan = domain.plans[planIndex];
  const toggle = (id: PanelId) => setOpenPanel((current) => (current === id ? null : id));

  const renderToggle = (id: PanelId, label: string) => (
    <button
      type="button"
      className={`cost-toggle ${openPanel === id ? 'is-open' : ''}`}
      aria-expanded={openPanel === id}
      aria-controls={PANEL_ID[id]}
      onClick={() => toggle(id)}
    >
      <span>{label}</span>
      <ChevronDown size={16} aria-hidden="true" />
    </button>
  );

  const panelProps = (id: PanelId, label: string) => ({
    id: PANEL_ID[id],
    className: `cost ${openPanel === id ? 'is-open' : ''}`,
    role: 'region' as const,
    'aria-label': label,
    ...(openPanel !== id ? ({ inert: '' } as Record<string, string>) : {}),
  });

  return (
    <div className="scene scene--proposal">
      <div className="scene__inner proposal">
        <div className="proposal__head">
          <p className="kicker">{PROPOSAL.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={[...PROPOSAL.title]} active={active} />
          <Reveal active={active} order={2} className="proposal__product">
            <span className="proposal__product-label">{PROPOSAL.productLabel}</span>
            <span className="proposal__product-name">{PROPOSAL.product}</span>
          </Reveal>
        </div>

        <Reveal active={active} order={2} className="proposal__lists">
          <section className="proposal__col" aria-labelledby="prop-scope">
            <h3 id="prop-scope" className="proposal__col-title">
              {PROPOSAL.scopeLabel}
            </h3>
            <ul className="proposal__list proposal__list--in" role="list">
              {PROPOSAL.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="proposal__col proposal__col--out" aria-labelledby="prop-out">
            <h3 id="prop-out" className="proposal__col-title">
              {PROPOSAL.outLabel}
            </h3>
            <ul className="proposal__list proposal__list--out" role="list">
              {PROPOSAL.out.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal active={active} order={3} className="proposal__bottom">
          <div className="proposal__terms">
            {PROPOSAL.terms.map((term) => (
              <div key={term.id} className="term">
                <p className="term__label">{term.label}</p>
                <p className="term__value">{term.value}</p>
              </div>
            ))}
            {renderToggle('cost', PROPOSAL.costButton)}
            {renderToggle('domain', PROPOSAL.domainButton)}
          </div>

          <div {...panelProps('cost', PROPOSAL.costButton)}>
            <div className="cost__clip">
              <article className="cost-card cost-card--labor">
                <div className="cost-card__main">
                  <p className="cost-card__tag">{cost.tag}</p>
                  <h3 className="cost-card__title">{cost.title}</h3>
                  <ul className="cost-card__list" role="list">
                    {cost.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="cost-card__price">
                  <p className="cost-card__amount">{cost.amount}</p>
                  <p className="cost-card__condition">{cost.condition}</p>
                </div>
              </article>
            </div>
          </div>

          <div {...panelProps('domain', domain.name)}>
            <div className="cost__clip">
              <article className="cost-card cost-card--labor cost-card--domain">
                <div className="cost-card__main">
                  <p className="cost-card__tag">{domain.label}</p>
                  <h3 className="cost-card__title">{domain.name}</h3>
                  <p className="cost-card__desc">{domain.description}</p>
                </div>
                <div className="cost-card__price" aria-live="polite">
                  <div key={plan.period} className="domain-swap">
                    <p className="cost-card__amount">{plan.price}</p>
                    <p className="cost-card__condition">{plan.caption}</p>
                    <p className="cost-card__ref">Valor cheio de referência: {plan.full}</p>
                  </div>
                </div>
                <div className="domain-periods" role="group" aria-label={domain.selectorLabel}>
                  {domain.plans.map((p, i) => (
                    <button
                      key={p.period}
                      type="button"
                      className={`domain-periods__btn ${i === planIndex ? 'is-selected' : ''}`}
                      aria-pressed={i === planIndex}
                      onClick={() => setPlanIndex(i)}
                    >
                      {p.period}
                    </button>
                  ))}
                </div>
                <p className="cost-card__note cost-card__note--wide">{domain.note}</p>
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
