import { Link, useLocation } from 'react-router-dom';

const NAV_GROUPS = [
  {
    label: 'Área de Gestão',
    links: [
      { to: '/gestao', hash: '#gerenciamento', icon: 'bi-pie-chart', text: 'Gerenciamento', isDefault: true },
      { to: '/gestao', hash: '#metas', icon: 'bi-trophy', text: 'Metas' },
    ],
  },
  {
    label: 'Meu Aprendizado',
    links: [
      { to: '/aprendizado', hash: '#questionarios', icon: 'bi-journals', text: 'Questionários', isDefault: true },
    ],
  },
];

/**
 * Menu lateral das telas internas.
 * isOpen / onClose controlam apenas a versão mobile (off-canvas); no desktop ele é sempre visível.
 */
function Sidebar({ isOpen = false, onClose }) {
  const { pathname, hash } = useLocation();

  // Ativo = mesma página + mesma âncora. Sem âncora na URL, vale o link marcado como padrão.
  const isActive = (link) => pathname === link.to && (hash ? hash === link.hash : Boolean(link.isDefault));

  return (
    <aside className={`qk-sidebar ${isOpen ? 'is-open' : ''}`.trim()}>
      <div className="qk-sidebar__inner">
        <div className="qk-sidebar__header">
          <button type="button" className="qk-sidebar__close" onClick={onClose} aria-label="Fechar menu">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="qk-sidebar__nav">
          <ul>
            {NAV_GROUPS.map((group) => (
              <li key={group.label}>
                <b>{group.label}</b>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.hash}>
                      <Link
                        to={`${link.to}${link.hash}`}
                        className={isActive(link) ? 'is-active' : ''}
                        onClick={onClose}
                      >
                        <i className={`bi ${link.icon}`}></i> {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
