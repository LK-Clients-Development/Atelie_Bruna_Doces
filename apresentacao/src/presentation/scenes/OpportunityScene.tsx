import { ArrowDown, ArrowRight, Image as ImageIcon, Info, Laptop, Layers, Megaphone, MessageCircle, Search, ShoppingBag, Sparkles, Store, BookOpen, type LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { SceneProps } from './types';
import { CATALOG_SURVEY, COMPARISON, SCENES, type OppIcon } from '../content';
import AnimatedCounter from '../components/AnimatedCounter';

const copy = SCENES.opportunity;

const ICONS: Record<OppIcon, LucideIcon> = {
  search: Search,
  megaphone: Megaphone,
  message: MessageCircle,
  store: Store,
  book: BookOpen,
  sparkles: Sparkles,
  image: ImageIcon,
  bag: ShoppingBag,
};

/** Ordem de entrada (ms = d × 90 + base) — dispara só enquanto a cena está ativa (ver .opp.is-active em v2.css). */
const d = (n: number): CSSProperties => ({ '--d': n }) as CSSProperties;

interface Step {
  n: number;
  label: string;
  icon: OppIcon;
}

function Pill({ step, delay, className = '' }: { step: Step; delay: number; className?: string }) {
  const Icon = ICONS[step.icon];
  return (
    <div className={`opp-pill ${className}`} data-anim style={d(delay)}>
      <span className="opp-num">{step.n}</span>
      <Icon className="opp-pill__icon" size={22} strokeWidth={1.6} aria-hidden="true" />
      <span className="opp-pill__label">{step.label}</span>
    </div>
  );
}

function Connector({ direction, delay }: { direction: 'right' | 'down'; delay: number }) {
  const Arrow = direction === 'right' ? ArrowRight : ArrowDown;
  return (
    <span className={`opp-arrow opp-arrow--${direction}`} data-anim style={d(delay)} aria-hidden="true">
      <Arrow size={20} strokeWidth={1.5} />
    </span>
  );
}

export default function OpportunityScene({ active }: SceneProps) {
  const { current, proposed, notes } = COMPARISON;

  return (
    <div className={`scene scene--opportunity opp ${active ? 'is-active' : ''}`}>
      <div className="scene__inner opportunity">
        <header className="opp-head">
          <div className="opp-head__text">
            <p className="opp-kicker" data-anim style={d(0)}>
              {copy.kicker}
            </p>
            <h2 className="display opp-title">
              <span className="opp-title__line" data-anim style={d(1)}>
                {copy.title[0]}
              </span>
              <span className="opp-title__line" data-anim style={d(2)}>
                fosse uma <span className="opp-em">experiência</span>?
              </span>
            </h2>
            <p className="opp-lead" data-anim style={d(3)}>
              {copy.subtitle}
            </p>
          </div>

          <ul className="opp-stats" role="list">
            <li className="opp-stat" data-anim style={d(3)}>
              <Layers className="opp-stat__icon" size={34} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <p className="opp-stat__num">
                  <AnimatedCounter value={CATALOG_SURVEY.categories} active={active} />
                </p>
                <p className="opp-stat__label">coleções</p>
              </div>
            </li>
            <li className="opp-stat" data-anim style={d(4)}>
              <ImageIcon className="opp-stat__icon" size={34} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <p className="opp-stat__num">
                  <AnimatedCounter value={CATALOG_SURVEY.products} active={active} duration={1.4} />
                </p>
                <p className="opp-stat__label">criações no cardápio</p>
              </div>
            </li>
          </ul>
        </header>

        <section className="opp-card opp-today" aria-label="Jornada atual" data-anim style={d(5)}>
          <div className="opp-card__label">
            <h3 className="opp-card__title">{current.label}</h3>
            <p className="opp-card__caption">{current.caption}</p>
          </div>
          <ol className="opp-flow" role="list">
            {current.steps.map((step, i) => (
              <li key={step.n} className="opp-flow__item">
                <Pill step={step} delay={6 + i * 2} />
                {i < current.steps.length - 1 && <Connector direction="right" delay={7 + i * 2} />}
              </li>
            ))}
          </ol>
        </section>

        <section className="opp-card opp-proposed" aria-label="Experiência proposta" data-anim style={d(10)}>
          <div className="opp-card__label">
            <h3 className="opp-card__title">
              {proposed.label[0]}{" "}
              <br />
              {proposed.label[1]}
            </h3>
            <p className="opp-card__caption">
              {proposed.caption[0]}{" "}
              <br />
              {proposed.caption[1]}
            </p>
          </div>

          <div className="opp-journey">
            <Pill step={proposed.entry} delay={11} className="opp-pill--solo" />
            <Connector direction="down" delay={12} />

            <div className="opp-hub" data-anim style={d(13)}>
              <p className="opp-hub__title">
                <Laptop size={26} strokeWidth={1.5} aria-hidden="true" />
                <span>{proposed.hub.title}</span>
              </p>
              <ol className="opp-hub__steps" role="list">
                {proposed.hub.steps.map((step, i) => {
                  const Icon = ICONS[step.icon];
                  return (
                    <li key={step.n} className="opp-step" data-anim style={d(14 + i)}>
                      <span className="opp-num">{step.n}</span>
                      <Icon className="opp-step__icon" size={28} strokeWidth={1.4} aria-hidden="true" />
                      <span className="opp-step__label">{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <Connector direction="down" delay={18} />
            <Pill step={proposed.exit} delay={19} className="opp-pill--solo" />
          </div>
        </section>

        <footer className="opp-notes" data-anim style={d(20)}>
          <Info className="opp-notes__icon" size={22} strokeWidth={1.4} aria-hidden="true" />
          <p>{notes.complement}</p>
          <p>{notes.survey}</p>
        </footer>
      </div>
    </div>
  );
}
