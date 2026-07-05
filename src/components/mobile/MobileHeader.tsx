import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { navLinks } from '../../data/content';
import brandLogo from '../../assets/main logo_-Photoroom.png';
import './MobileHeader.css';

export default function MobileHeader() {
  const [atTop, setAtTop] = useState(true);
  const [bounceNav, setBounceNav] = useState(false);
  const navStripRef = useRef<HTMLDivElement>(null);
  const wasAtTop = useRef(true);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY < 8;
      setAtTop(top);

      if (top && !wasAtTop.current) {
        setBounceNav(true);
        setTimeout(() => setBounceNav(false), 900);
      }
      wasAtTop.current = top;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (atTop && navStripRef.current) {
      const el = navStripRef.current;
      if (el.scrollWidth > el.clientWidth) {
        const t = setTimeout(() => {
          setBounceNav(true);
          setTimeout(() => setBounceNav(false), 900);
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, [atTop]);

  return (
    <header className="mobile-header">
      <div className="mobile-header__top">
        <a href="#" className="mobile-header__logo">
          <motion.div
            className="mobile-header__logo-mark"
            layoutId="mobile-brand-logo"
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="mobile-header__logo-glow" aria-hidden="true" />
            <img
              src={brandLogo}
              alt="investrategy"
              className="mobile-header__logo-img"
            />
          </motion.div>
        </a>
      </div>

      <motion.div
        ref={navStripRef}
        className={`mobile-header__nav-strip${bounceNav ? ' mobile-header__nav-strip--bounce' : ''}`}
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="mobile-header__pill liquid-glass-pill">
            <span className="mobile-header__pill-dot" />
            {link.label}
          </a>
        ))}
      </motion.div>
    </header>
  );
}
