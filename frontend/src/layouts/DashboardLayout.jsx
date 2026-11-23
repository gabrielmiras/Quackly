import { useState } from 'react';
import { Menu, CircleUserRound } from 'lucide-react';

import Sidebar from '../components/Sidebar.jsx';

function DashboardLayout({ children, userName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main min-w-0">
        <header className="dash-header">

          {/* Botão do menu mobile */}
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={sidebarOpen}
              className="
                dash-menu-button
                lg:hidden
              "
            >
              <Menu size={27} strokeWidth={2} />
            </button>
          )}

          {/* Usuário */}
          <div className="dash-header__user">
            <span>{nomeExibicao}</span>

            <div className="dash-header__avatar">
              <CircleUserRound
                size={32}
                strokeWidth={1.8}
              />
            </div>
          </div>
        </header>

        <main className="dash-content min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
