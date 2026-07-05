import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../../data/content';
import brandLogo from '../../assets/investrategy logo.png';
import './MobileHeader.css';

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="mobile-header">
      <div className="mobile-header__top">
        <button
          type="button"
          className="mobile-header__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? 'open' : ''} />
        </button>

        <a href="#" className="mobile-header__logo">
          <motion.img
            src={brandLogo}
            alt="investrategy"
            layoutId="mobile-brand-logo"
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </a>

        <div className="mobile-header__spacer" aria-hidden="true" />
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

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="mobile-header__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              aria-label="Close menu"
            />
            <motion.nav
              className="mobile-header__menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mobile-header__menu-label">Pages</p>
              <div className="mobile-header__menu-grid">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="mobile-header__menu-pill liquid-glass-pill"
                    onClick={closeMenu}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <span className="mobile-header__pill-dot" />
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
