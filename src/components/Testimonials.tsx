import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/content';
import './Testimonials.css';

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonials" id="stories" ref={ref}>
      <div className="container">
        <motion.div
          className="testimonials__header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Real Stories</p>
          <h2 className="section-title">Trust built through every market cycle</h2>
          <p className="section-subtitle">
            Families across Bharat who chose disciplined, goal-based investing with Investrategy —
            and stayed confident through it all.
          </p>
        </motion.div>

        <motion.div
          className="testimonials__panel glass-strong liquid-glass"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              className="testimonials__quote"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <span className="testimonials__emoji">{testimonials[active].emoji}</span>
              <p>&ldquo;{testimonials[active].quote}&rdquo;</p>
              <footer>
                <strong>{testimonials[active].name}</strong>
                <span>{testimonials[active].detail}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="testimonials__dots">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                className={`testimonials__dot ${active === i ? 'testimonials__dot--active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Story from ${t.name}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="testimonials__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p>Ready to start your disciplined investing journey?</p>
          <a href="#contact" className="btn-primary">
            Start with a Free Visit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
