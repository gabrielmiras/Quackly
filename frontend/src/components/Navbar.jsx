import { useState } from 'react';
import Button from './Button.jsx';
import logo from '../assets/logo-quackly.png';

const NAV_LINKS = [
  { href: '#features', label: 'Recursos' },
  { href: '#mentor', label: 'Mentor Virtual' },
  { href: '#pricing', label: 'Benefícios' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-transparent">
      <div className="container qk-navbar__inner">
        <a className="navbar-brand qk-navbar__brand" href="#top">
          <img src={logo} alt="Logo" className="qk-navbar__logo" style={{ transform: 'scale(1.2)' }} />
          Quackly
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Abrir menu de navegação"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-center ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            {NAV_LINKS.map((link) => (
              <li className="nav-item" key={link.href}>
                <a className="nav-link qk-navbar__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="d-none d-lg-block">
          <Button variant="nav" to="/login">
            Entrar
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
