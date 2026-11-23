
import { Link, useLocation } from 'react-router-dom';
import {
  ChartPie,
  Trophy,
  History,
  BookOpen,
  X,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'ÁREA DE GESTÃO',
    links: [
      {
        to: '/gestao',
        hash: '#gerenciamento',
        icon: ChartPie,
        text: 'Gerenciamento',
        isDefault: true,
      },
      {
        to: '/gestao',
        hash: '#metas',
        icon: Trophy,
        text: 'Metas',
      },
      {
        to: '/historico',
        hash: '',
        icon: History,
        text: 'Histórico',
        isDefault: true,
      },
    ],
  },
  {
    label: 'MEU APRENDIZADO',
    links: [
      {
        to: '/aprendizado',
        hash: '#questionarios',
        icon: BookOpen,
        text: 'Questionários',
        isDefault: true,
      },
    ],
  },
];

function Sidebar({ isOpen = false, onClose }) {
  const { pathname, hash } = useLocation();

  const isActive = (link) =>
    pathname === link.to &&
    (hash ? hash === link.hash : Boolean(link.isDefault));

  return (
    <>
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className={`
          fixed inset-0 z-[1039]
          border-0 bg-black/60
          backdrop-blur-[2px]
          transition-opacity duration-300
          lg:hidden
          ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
        `}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-[1040]
          flex h-screen w-[280px] max-w-[85vw] flex-col
          border-r border-white/[0.06]
          bg-[#142238] text-white
          shadow-[8px_0_30px_rgba(0,0,0,0.2)]
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto
          lg:h-screen lg:w-[260px] lg:max-w-none
          lg:shrink-0 lg:translate-x-0 lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Cabeçalho */}
        <div className="
          flex h-[76px] shrink-0
          items-center justify-between
          border-b border-white/[0.06]
          px-6
        ">
          <span
            className="font-bold tracking-wide text-white"
            style={{ fontSize: '18px' }}
          >
            Quackly<span className="text-[#FFCB61]">.</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg border-0 bg-transparent
              text-[#94a3b8]
              transition-colors
              hover:bg-white/[0.06] hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-7">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-7 last:mb-0">
              <h3
                className="mb-3 px-3 font-bold uppercase"
                style={{
                  fontSize: '11px',
                  lineHeight: '1.5',
                  letterSpacing: '1.2px',
                  color: '#64748b',
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                }}
              >
                {group.label}
              </h3>

              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {group.links.map((link) => {
                  const active = isActive(link);
                  const Icon = link.icon;

                  return (
                    <li key={link.to + link.hash} className="m-0">
                      <Link
                        to={`${link.to}${link.hash}`}
                        onClick={onClose}
                        className={`
                          group relative
                          flex items-center gap-3
                          rounded-xl px-3 py-3
                          !no-underline hover:!no-underline
                          transition-all duration-200
                          ${
                            active
                              ? 'bg-[#FFCB61]/[0.12] !text-[#FFCB61]'
                              : '!text-[#a8b5c8] hover:bg-white/[0.05] hover:!text-white'
                          }
                        `}
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.4',
                          fontWeight: 500,
                        }}
                      >
                        {active && (
                          <span className="
                            absolute bottom-2 left-0 top-2
                            w-[3px] rounded-r-full
                            bg-[#FFCB61]
                          " />
                        )}

                        <Icon
                          size={18}
                          strokeWidth={active ? 2.2 : 1.8}
                          className={`
                            shrink-0 transition-colors
                            ${
                              active
                                ? 'text-[#FFCB61]'
                                : 'text-[#8493a9] group-hover:text-white'
                            }
                          `}
                        />

                        <span>{link.text}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Rodapé */}
        <div className="
          shrink-0 border-t border-white/[0.06]
          px-6 py-5
        ">
          <p className="text-xs text-[#64748b]">
            Quackly
          </p>
          <p className="mt-1 text-[0.7rem] text-[#475569]">
            Sua jornada financeira
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
