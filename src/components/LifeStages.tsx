import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { lifeStages } from '../data/content';
import './LifeStages.css';

export default function LifeStages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const stage = lifeStages[active];

  const selectStage = (i: number) => {
    setActive(i);
    setHasInteracted(true);
  };

  return (
    <section className="stages" id="stages" ref={ref}>
      <div className="container">
        <motion.div
          className="stages__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Who We Serve</p>
          <h2 className="section-title">Every chapter of life deserves a great plan</h2>
          <p className="section-subtitle">
            Wherever you are on your journey, we bring warmth, expertise, and a plan that grows
            right alongside you.
          </p>
        </motion.div>

        <div className="stages__layout">
          <p
            className={`stages__hint${hasInteracted ? ' stages__hint--done' : ' stages__hint--pulse'}`}
            aria-hidden={hasInteracted}
          >
            <span className="stages__hint-hand">👇</span>
            <span>Click a life stage to explore</span>
          </p>

          <div className="stages__tabs" role="tablist" aria-label="Life stages">
            {lifeStages.map((item, i) => (
              <motion.button
                key={item.id}
                role="tab"
                aria-selected={active === i}
                className={`stages__tab glass ${active === i ? 'stages__tab--active' : ''}${
                  !hasInteracted && active !== i ? ' stages__tab--blink' : ''
                }`}
                onClick={() => selectStage(i)}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <span className="stages__tab-icon">{item.icon}</span>
                <div>
                  <span className="stages__tab-title">{item.title}</span>
                  <span className="stages__tab-age">{item.age}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="stages__panel glass-strong liquid-glass">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="stages__panel-inner"
              >
                <div className="stages__panel-meta">
                  <span className="stages__panel-icon">{stage.icon}</span>
                  <h3>{stage.title}</h3>
                  <span className="stages__panel-age">{stage.age}</span>
                </div>

                <div className="stages__panel-body">
                  <p>{stage.description}</p>
                  <ul className="stages__focus">
                    {stage.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a href="#contact" className="btn-primary stages__cta">
                    Let&apos;s Talk →
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
