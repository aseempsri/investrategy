import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { resources } from '../data/content';
import './Resources.css';

export default function Resources() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="resources" id="resources" ref={ref}>
      <div className="container">
        <motion.div
          className="resources__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Financial Learning Center</p>
          <h2 className="section-title">Learn it. Love it. Live it.</h2>
          <p className="section-subtitle">
            Friendly guides and resources that make financial knowledge feel accessible — and
            maybe even a little fun.
          </p>
        </motion.div>

        <div className="resources__grid">
          {resources.map((item, i) => (
            <motion.a
              key={item.title}
              href={'href' in item && item.href ? item.href : '#contact'}
              className="resources__card glass liquid-glass"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <span className="resources__category">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="resources__link">
                Learn More
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="resources__cta glass-strong liquid-glass"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="resources__cta-content">
            <h3>Retirement Readiness Toolkit</h3>
            <p>
              Retirement is one of life&apos;s biggest transitions. Use this free guide to clarify
              your goals, reduce uncertainty, and design a retirement strategy that supports the
              life you truly want.
            </p>
          </div>
          <form className="resources__form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="email" placeholder="Email" required />
            <button type="submit" className="btn-primary">Get My Free Guide</button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
