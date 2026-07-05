import type { ReactNode } from 'react';
import { formatInr } from '../../utils/finance';

export const CALC_DISCLAIMER =
  'Illustrative estimates only. Does not reflect performance of any specific product. Consult a professional before making financial decisions.';

type SliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  display: ReactNode;
};

export function SliderField({ label, value, onChange, min, max, step = 1, display }: SliderProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <strong>{display}</strong>
    </label>
  );
}

type ResultItem = {
  label: string;
  value: string | number;
  accent?: boolean;
  total?: boolean;
  format?: 'currency' | 'number' | 'percent' | 'text';
};

export function ResultGrid({ items }: { items: ResultItem[] }) {
  return (
    <div className={`calc-results glass ${items.length === 4 ? 'calc-results--quad' : ''}`}>
      {items.map((item) => {
        let display = item.value;
        if (typeof item.value === 'number') {
          if (item.format === 'percent') display = `${item.value}%`;
          else if (item.format === 'currency') display = formatInr(item.value);
          else display = item.value.toLocaleString('en-IN');
        }
        return (
          <div
            key={item.label}
            className={`calc-result${item.total ? ' calc-result--total' : ''}`}
          >
            <span>{item.label}</span>
            <strong className={item.accent ? 'calc-result--accent' : undefined}>{display}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function CalcPanel({ children, disclaimer = CALC_DISCLAIMER }: { children: ReactNode; disclaimer?: string }) {
  return (
    <div className="calc-panel">
      {children}
      <p className="calc-disclaimer">{disclaimer}</p>
    </div>
  );
}

export { formatInr };
