import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { services } from '../data/content';
import './Services.css';

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="services" id="services" ref={ref}>
      <div className="container">
        <motion.div
          className="services__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Expertise & Offerings</p>
          <h2 className="section-title">Everything you need, nothing you don&apos;t</h2>
          <p className="section-subtitle">
            Thoughtful services designed to simplify your financial life — so you can spend less
            time worrying and more time living.
          </p>
        </motion.div>

        <div className="services__grid">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="services__card glass liquid-glass"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <span className="services__tag">{service.tag}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#contact" className="services__link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
