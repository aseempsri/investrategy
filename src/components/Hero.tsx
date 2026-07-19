import { motion } from 'framer-motion';
import Scene3D from './Scene3D';
import TypewriterTitle from './TypewriterTitle';
import { heroBadges, stats } from '../data/content';
import treeLogo from '../assets/t logo_new.png';
import './Hero.css';

interface HeroProps {
  isMobileReady?: boolean;
}

export default function Hero({ isMobileReady = false }: HeroProps) {
  return (
    <section className={`hero${isMobileReady ? ' hero--mobile' : ''}`} id="home">
      <Scene3D />

      <div className="hero__content container">
        <div className="hero__main">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="section-label">Financial Life Planning · Est. 2008</p>
            <TypewriterTitle />
            <motion.div
              className="hero__badges"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              {heroBadges.map((badge) => (
                <span key={badge} className="hero__badge glass">
                  {badge}
                </span>
              ))}
            </motion.div>
            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.8 }}
            >
              Not harder hours. Not louder markets. Just a clearer plan — so your money works
              for the life you want. Since 2008, Investrategy has guided households across Bharat
              with discipline, clarity, and confidence through every market cycle.
            </motion.p>
            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.1 }}
            >
              <a href="#contact" className="btn-primary">
                Start Your Free Consultation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#about" className="btn-secondary">
                Our Story Since 2008
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual hero__visual--desktop"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            aria-hidden="true"
          >
            <div className="hero__visual-glow" />
            <motion.img
              src={treeLogo}
              alt=""
              className="hero__tree"
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        <motion.div
          className="hero__stats glass liquid-glass"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="hero__stats-inner">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="hero__stat"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}
