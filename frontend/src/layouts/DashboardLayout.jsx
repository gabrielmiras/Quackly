import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import logo from '../assets/logo-quackly.png';

/**
 * Casco das telas internas: sidebar + header + área de conteúdo.
 * - A sidebar ocupa a altura total da página (ver .qk-sidebar no global.css).
 * - O header é sticky, então continua visível durante o scroll.
 */
function DashboardLayout({ children, userName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pega o nome do usuário salvo no login (se houver)
  const usuarioSalvo = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuarioLogado'));
    } catch {
      return null;
    }
  })();

  const nomeExibicao = userName || usuarioSalvo?.nome || 'Usuário 1';

  return (
    <div className="dash-page">
      <button
        type="button"
        className="dash-hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <i className="bi bi-list"></i>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dash-main">
        <header className="dash-header">
          <div className="dash-header__logo">
            <Link to="/">
              <img src={logo} alt="Logo Pato" />
            </Link>
          </div>
          <div className="dash-header__user">
            <span>{nomeExibicao}</span>
            <div className="dash-header__avatar">
              <i className="bi bi-person-circle"></i>
            </div>
          </div>
        </header>

        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
