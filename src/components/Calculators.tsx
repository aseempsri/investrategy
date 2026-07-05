import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { calculators } from '../data/content';
import {
  DelayCalculatorPanel,
  EducationCalculatorPanel,
  EmiCalculatorPanel,
  HlvCalculatorPanel,
  LumpsumCalculatorPanel,
  MarriageCalculatorPanel,
  RetirementCalculatorPanel,
  SIPCalculatorPanel,
  SipTopUpCalculatorPanel,
  TaxCalculatorPanel,
} from './calculators/CalculatorPanels';
import './Calculators.css';

const PANELS: Record<string, () => React.JSX.Element> = {
  sip: SIPCalculatorPanel,
  retirement: RetirementCalculatorPanel,
  education: EducationCalculatorPanel,
  lumpsum: LumpsumCalculatorPanel,
  emi: EmiCalculatorPanel,
  tax: TaxCalculatorPanel,
  delay: DelayCalculatorPanel,
  hlv: HlvCalculatorPanel,
  topup: SipTopUpCalculatorPanel,
  marriage: MarriageCalculatorPanel,
};

export default function Calculators() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState('sip');

  const ActivePanel = PANELS[active] ?? SIPCalculatorPanel;

  return (
    <section className="calculators" id="calculators" ref={ref}>
      <div className="container">
        <motion.div
          className="calculators__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Planning Tools</p>
          <h2 className="section-title">Play with your possibilities</h2>
          <p className="section-subtitle">
            Explore the numbers behind your dreams — friendly calculators that help you see a
            brighter financial future taking shape.
          </p>
        </motion.div>

        <div className="calculators__layout">
          <motion.div
            className="calculators__list"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {calculators.map((calc) => (
              <button
                key={calc.id}
                className={`calculators__item glass ${active === calc.id ? 'calculators__item--active' : ''}`}
                onClick={() => setActive(calc.id)}
              >
                <span className="calculators__item-name">{calc.name}</span>
                <span className="calculators__item-desc">{calc.desc}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            className="calculators__panel glass-strong liquid-glass"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ActivePanel />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
