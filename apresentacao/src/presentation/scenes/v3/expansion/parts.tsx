import { ArrowRight } from 'lucide-react';
import type { SceneProps } from '../../types';

export interface XpSceneProps extends SceneProps {
  /** Avança para a próxima etapa da expansão (botão de aprofundamento da própria cena). */
  onNext?: () => void;
}

/** Cabeçalho comum: "EXPANSÃO COMERCIAL" em destaque + selo da opção. */
export function XpEyebrow({ label, option }: { label: string; option?: string }) {
  return (
    <div className="xp-eyebrow">
      <p className="xp-eyebrow__label">{label}</p>
      {option && <p className="xp-eyebrow__option">{option}</p>}
    </div>
  );
}

export function XpButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="xp-cta" onClick={onClick}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </button>
  );
}

/** Barras simples (SVG-free, só CSS) para exemplos ilustrativos. */
export function MiniBars({ values, labels, label }: { values: readonly number[]; labels?: readonly string[]; label: string }) {
  const max = Math.max(...values);
  return (
    <div className="xp-bars" role="img" aria-label={label}>
      {values.map((v, i) => (
        <div key={i} className="xp-bars__col">
          <span className="xp-bars__bar" style={{ height: `${Math.round((v / max) * 100)}%`, animationDelay: `${i * 50}ms` }} />
          {labels && <span className="xp-bars__lbl">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

/** Barras horizontais com rótulo (categorias ilustrativas). */
export function HBars({ rows, suffix = '' }: { rows: readonly { label: string; value: number }[]; suffix?: string }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="xp-hbars" role="list">
      {rows.map((r, i) => (
        <li key={r.label}>
          <span className="xp-hbars__label">{r.label}</span>
          <span className="xp-hbars__track">
            <span className="xp-hbars__fill" style={{ width: `${Math.round((r.value / max) * 100)}%`, animationDelay: `${i * 80}ms` }} />
          </span>
          <span className="xp-hbars__value">
            {r.value}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}
