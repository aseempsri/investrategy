import { company } from '../data/content';
import brandLogo from '../assets/main logo_-Photoroom.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <img src={brandLogo} alt="investrategy" />
            <p className="footer__tagline">{company.tagline}</p>
            <p>
              Building financial discipline, fostering trust, and nurturing long-term relationships
              that endure beyond market cycles — since {company.founded}.
            </p>
          </div>

          <div className="footer__links">
            <div>
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Goal-Based Planning</a></li>
                <li><a href="#services">SIP & Investing</a></li>
                <li><a href="#services">Portfolio Management</a></li>
                <li><a href="#services">Financial Literacy</a></li>
              </ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li><a href="#calculators">Calculators</a></li>
                <li><a href="#documents">Client Forms</a></li>
                <li><a href="#resources">Learning Center</a></li>
                <li><a href="#process">Our Process</a></li>
                <li><a href="#stories">Client Stories</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#about">Our Mission</a></li>
                <li><a href="#stages">Who We Serve</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__disclaimer glass">
          <p>
            <strong>{company.founder}</strong> — {company.founderTitle} (ARN No. {company.arn}).{' '}
            {company.amfiNote}
          </p>
          <p>
            Investrategy is empanelled with leading Asset Management Companies (AMCs) registered in
            India, offering mutual fund solutions across equity, debt, and hybrid categories.
          </p>
          <p>
            Mutual fund investments are subject to market risks. Please read all scheme-related
            documents carefully before investing. Past performance is not indicative of future
            results. Calculators are hypothetical examples for illustration purposes only.
          </p>
          <p>
            The content on this website is for general informational purposes only and does not
            constitute tax, legal, or investment advice. Please consult professionals for guidance
            specific to your situation. {company.privacyNote}
          </p>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Investrategy. All rights reserved. Est. {company.founded}.</p>
          <div className="footer__legal">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
