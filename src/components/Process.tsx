import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { processSteps } from '../data/content';
import './Process.css';

export default function Process() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="process" id="process" ref={ref}>
      <div className="container">
        <motion.div
          className="process__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Our Process</p>
          <h2 className="section-title">Simple steps, big peace of mind</h2>
          <p className="section-subtitle">
            From your first hello to lifelong partnership — a journey that feels easy, supportive,
            and genuinely enjoyable.
          </p>
        </motion.div>

        <div className="process__timeline">
          <div className="process__line">
            <motion.div className="process__line-fill" style={{ height: lineHeight }} />
          </div>

          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              className={`process__step ${i % 2 === 0 ? 'process__step--left' : 'process__step--right'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
            >
              <div className="process__step-card glass liquid-glass">
                <span className="process__step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="process__dot" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="process__docs-link glass liquid-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p>
            Ready to get started? Download the risk profiler, data consent form, and other
            client documents you&apos;ll need during onboarding.
          </p>
          <a href="#documents" className="btn-secondary">
            View Client Forms →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
