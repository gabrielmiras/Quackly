import { useEffect, useState } from 'react';
import { Menu, CircleUserRound, Sun, Moon } from 'lucide-react';

import Sidebar from '../components/Sidebar.jsx';

function DashboardLayout({ children, userName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('quackly-theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quackly-theme', tema);
    } catch {
      // A aplicação continua funcionando mesmo se o armazenamento estiver indisponível.
    }
  }, [tema]);

  const usuarioSalvo = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuarioLogado'));
    } catch {
      return null;
    }
  })();

  const nomeExibicao = userName || usuarioSalvo?.nome || 'Usuário 1';

  function alternarTema() {
    setTema((atual) => (atual === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="dash-page" data-theme={tema}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main min-w-0">
        <header className="dash-header">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={sidebarOpen}
              className="dash-menu-button lg:hidden"
            >
              <Menu size={27} strokeWidth={2} />
            </button>
          )}

          <div className="dash-header__actions">
            <button
              type="button"
              onClick={alternarTema}
              className="dash-theme-toggle"
              aria-label={
                tema === 'dark'
                  ? 'Ativar tema claro'
                  : 'Ativar tema escuro'
              }
              title={
                tema === 'dark'
                  ? 'Ativar tema claro'
                  : 'Ativar tema escuro'
              }
            >
              {tema === 'dark' ? (
                <Sun size={21} />
              ) : (
                <Moon size={21} />
              )}
            </button>

            <div className="dash-header__user">
              <span>{nomeExibicao}</span>

              <div className="dash-header__avatar">
                <CircleUserRound size={32} strokeWidth={1.8} />
              </div>
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