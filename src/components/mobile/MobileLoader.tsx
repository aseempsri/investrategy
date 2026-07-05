import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import heroTree from '../../assets/image.png';
import brandLogo from '../../assets/investrategy logo.png';
import './MobileLoader.css';

interface MobileLoaderProps {
  onComplete: () => void;
}

const DURATION_MS = 2000;

export default function MobileLoader({ onComplete }: MobileLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(pct);

      if (elapsed < DURATION_MS) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          onComplete();
        }, 200);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      className="mobile-loader"
      data-exiting={exiting ? 'true' : 'false'}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
    >
      <div className="mobile-loader__content">
        <motion.img
          src={heroTree}
          alt=""
          className="mobile-loader__tree"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.img
          src={brandLogo}
          alt="investrategy"
          className="mobile-loader__logo"
          layoutId="mobile-brand-logo"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <div className="mobile-loader__progress-wrap">
          <div className="mobile-loader__progress-label">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
          <div className="mobile-loader__track">
            <motion.div
              className="mobile-loader__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
