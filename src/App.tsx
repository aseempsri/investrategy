import { useState, useCallback } from 'react';
import { LayoutGroup } from 'framer-motion';
import { useIsMobile } from './hooks/useIsMobile';
import Navbar from './components/Navbar';
import MobileLoader from './components/mobile/MobileLoader';
import MobileHeader from './components/mobile/MobileHeader';
import MobileFloatingActions from './components/mobile/MobileFloatingActions';
import Hero from './components/Hero';
import About from './components/About';
import LifeStages from './components/LifeStages';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Process from './components/Process';
import ClientDocuments from './components/ClientDocuments';
import Calculators from './components/Calculators';
import Resources from './components/Resources';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const isMobile = useIsMobile();
  const [mobileReady, setMobileReady] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(max-width: 900px)').matches,
  );
  const [showLoader, setShowLoader] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches,
  );

  const handleLoadComplete = useCallback(() => {
    setMobileReady(true);
    setTimeout(() => setShowLoader(false), 650);
  }, []);

  return (
    <LayoutGroup>
      <div className={`app-root${isMobile && mobileReady ? ' app-root--mobile' : ''}`}>
        {showLoader && <MobileLoader onComplete={handleLoadComplete} />}

        {!isMobile && <Navbar />}

        {(!isMobile || mobileReady) && (
        <main className={isMobile && mobileReady ? 'main--mobile' : undefined}>
          {isMobile && mobileReady && <MobileHeader />}
          <Hero isMobileReady={isMobile && mobileReady} />
          <About />
          <LifeStages />
          <Services />
          <Testimonials />
          <Process />
          <ClientDocuments />
          <Calculators />
          <Resources />
          <Contact />
        </main>
        )}

        {(!isMobile || mobileReady) && <Footer />}
        {isMobile && mobileReady && <MobileFloatingActions />}
      </div>
    </LayoutGroup>
  );
}
