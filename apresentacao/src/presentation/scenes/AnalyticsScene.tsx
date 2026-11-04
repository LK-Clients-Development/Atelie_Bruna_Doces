import { Eye, EyeOff, ShoppingCart, TrendingUp } from 'lucide-react';
import type { SceneProps } from './types';
import { ANALYTICS_DEMO, SCENES } from '../content';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import AnimatedCounter from '../components/AnimatedCounter';

const copy = SCENES.analytics;

export default function AnalyticsScene({ active }: SceneProps) {
  return (
    <div className="scene scene--analytics">
      <div className="scene__inner analytics">
        <div className="scene__head">
          <p className="kicker">{copy.kicker}</p>
          <SplitText as="h2" className="display display--lg" lines={copy.title} active={active} />
        </div>

        <Reveal active={active} order={1} className="analytics__panel">
          <p className="analytics__disclaimer">{ANALYTICS_DEMO.disclaimer}</p>
          <p className="analytics__product">
            <TrendingUp size={18} aria-hidden="true" /> {ANALYTICS_DEMO.product}
          </p>
          <div className="analytics__metrics">
            <div className="metric">
              <Eye size={22} aria-hidden="true" />
              <p className="metric__num">
                <AnimatedCounter value={ANALYTICS_DEMO.views} active={active} />
              </p>
              <p className="metric__label">visualizações</p>
            </div>
            <div className="metric">
              <ShoppingCart size={22} aria-hidden="true" />
              <p className="metric__num">
                <AnimatedCounter value={ANALYTICS_DEMO.purchases} active={active} />
              </p>
              <p className="metric__label">compras</p>
            </div>
            <div className="metric metric--muted">
              <EyeOff size={22} aria-hidden="true" />
              <p className="metric__num">
                <AnimatedCounter value={ANALYTICS_DEMO.viewsWithoutPurchase} active={active} />
              </p>
              <p className="metric__label">visitas sem compra</p>
            </div>
          </div>
        </Reveal>

        <Reveal active={active} order={2} className="analytics__question">
          <p className="display display--md">“{ANALYTICS_DEMO.question}”</p>
        </Reveal>

        <Reveal active={active} order={3}>
          <p className="fine-print">{ANALYTICS_DEMO.note}</p>
        </Reveal>
      </div>
    </div>
  );
}
