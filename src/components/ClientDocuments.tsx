import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { clientDocuments, documentCategories } from '../data/content';
import './ClientDocuments.css';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2v8M8 10l3-3M8 10L5 7M3 12h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientDocuments() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="documents" id="documents" ref={ref}>
      <div className="container">
        <motion.div
          className="documents__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Client Documents</p>
          <h2 className="section-title">Download, complete & submit</h2>
          <p className="section-subtitle">
            Everything you need for onboarding, compliance, and communication — in one place.
            Download the form that applies to you, fill it in, and share it with your advisor or
            our team to move forward.
          </p>
        </motion.div>

        <motion.div
          className="documents__steps glass liquid-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
        >
          <div className="documents__step">
            <span className="documents__step-num">1</span>
            <div>
              <strong>Download</strong>
              <p>Choose the document below and save it to your device.</p>
            </div>
          </div>
          <div className="documents__step">
            <span className="documents__step-num">2</span>
            <div>
              <strong>Complete</strong>
              <p>Fill in your details, sign where required, and attach supporting files if needed.</p>
            </div>
          </div>
          <div className="documents__step">
            <span className="documents__step-num">3</span>
            <div>
              <strong>Submit</strong>
              <p>Return the form to your advisor in person, via email, or through our contact section.</p>
            </div>
          </div>
        </motion.div>

        {documentCategories.map((category, catIndex) => {
          const docs = clientDocuments.filter((d) => d.category === category.id);

          return (
            <motion.div
              key={category.id}
              className="documents__category"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + catIndex * 0.1 }}
            >
              <div className="documents__category-header">
                <span className="documents__category-icon">{category.icon}</span>
                <div>
                  <h3>{category.label}</h3>
                  <p>{category.intro}</p>
                </div>
              </div>

              <div className="documents__grid">
                {docs.map((doc, i) => (
                  <motion.article
                    key={doc.id}
                    className="documents__card glass liquid-glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.25 + catIndex * 0.1 + i * 0.06 }}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    <div className="documents__card-body">
                      <span className="documents__file-type">DOCX</span>
                      <h4>{doc.title}</h4>
                      <p className="documents__desc">{doc.description}</p>
                      <div className="documents__how">
                        <span className="documents__how-label">How to use</span>
                        <p>{doc.howToUse}</p>
                      </div>
                    </div>
                    <a
                      href={doc.file}
                      download
                      className="documents__download btn-primary"
                    >
                      <DownloadIcon />
                      Download Form
                    </a>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          );
        })}

        <motion.div
          className="documents__footer-cta glass-strong liquid-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div>
            <h3>Need help choosing the right form?</h3>
            <p>
              Not sure which document applies to your situation? Book a free consultation and
              we&apos;ll guide you through onboarding, risk profiling, and any declarations required.
            </p>
          </div>
          <a href="#contact" className="btn-secondary documents__contact-btn">
            Talk to an Advisor →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
