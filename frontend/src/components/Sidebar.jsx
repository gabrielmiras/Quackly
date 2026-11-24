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
    label: 'GESTÃO',
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
        hash: '#historico',
        icon: History,
        text: 'Histórico',
      },
      {
        to: '/metas',
        hash: '#metas',
        icon: Trophy,
        text: 'Metas',
        isDefault: true,
      },
    ],
  },
  {
    label: 'APRENDIZADO',
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
      {/* Fundo escuro do menu mobile */}
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        className={`
          fixed inset-0 z-[1039]
          border-0 bg-[#081426]/65
          backdrop-blur-[3px]
          transition-opacity duration-300
          lg:hidden
          ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
        `}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-[1040]
          flex h-screen w-[280px] max-w-[85vw]
          flex-col
          border-r border-white/[0.06]
          bg-[#142238] text-white
          shadow-[8px_0_30px_rgba(0,0,0,0.16)]
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto
          lg:h-screen lg:w-[260px]
          lg:max-w-none lg:shrink-0
          lg:translate-x-0 lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Cabeçalho */}
        <div className="
          flex h-[90px] shrink-0
          items-center justify-between
          border-b border-white/[0.07]
          px-6
        ">
          <Link
            to="/"
            onClick={onClose}
            aria-label="Quackly - página inicial"
            className="
              flex items-center
              !text-white !no-underline
            "
          >
            <span
              className="font-extrabold tracking-tight"
              style={{
                fontSize: '21px',
                lineHeight: '1.2',
              }}
            >
              Quackly<span className="text-[#FFCB61]">.</span>
            </span>
          </Link>

          {/* Fechar menu no celular */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg border-0 bg-transparent
              text-[#94a3b8] transition-colors
              hover:bg-white/[0.07] hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegação */}
        <nav
          aria-label="Navegação principal"
          className="
            min-h-0 flex-1
            overflow-y-auto overflow-x-hidden
            px-4 py-7
          "
        >
          {NAV_GROUPS.map((group) => (
            <div
              key={group.label}
              className="mb-8 last:mb-0"
            >
              {/* Título da categoria */}
              <div className="mb-3 px-3">
                <span
                  className="
                    block font-bold uppercase
                    text-[#71839d]
                  "
                  style={{
                    fontSize: '10px',
                    lineHeight: '1.5',
                    letterSpacing: '1.5px',
                  }}
                >
                  {group.label}
                </span>
              </div>

              {/* Links */}
              <ul className="
                m-0 flex list-none
                flex-col gap-1 p-0
              ">
                {group.links.map((link) => {
                  const active = isActive(link);
                  const Icon = link.icon;

                  return (
                    <li
                      key={link.to + link.hash}
                      className="m-0"
                    >
                      <Link
                        to={`${link.to}${link.hash}`}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={`
                          group relative flex h-[46px]
                          items-center gap-3
                          rounded-xl px-3
                          !no-underline
                          transition-all duration-200
                          ${
                            active
                              ? 'bg-[#FFCB61]/[0.12] !text-[#FFCB61]'
                              : '!text-[#9cabc0] hover:bg-white/[0.055] hover:!text-white'
                          }
                        `}
                      >
                        {/* Indicador da página ativa */}
                        {active && (
                          <span className="
                            absolute bottom-2 left-0 top-2
                            w-[3px] rounded-r-full
                            bg-[#FFCB61]
                          " />
                        )}

                        <Icon
                          size={19}
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

                        <span
                          className="font-medium"
                          style={{
                            fontSize: '13px',
                            lineHeight: '1.4',
                          }}
                        >
                          {link.text}
                        </span>

                        {active && (
                          <span className="
                            ml-auto h-1.5 w-1.5
                            shrink-0 rounded-full
                            bg-[#FFCB61]
                          " />
                        )}
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
          shrink-0 border-t border-white/[0.07]
          px-6 pt-6 pb-3
        ">
          <p className="
            m-0 text-xs font-semibold
            text-[#94a3b8]
          ">
            Quackly • 2026
          </p>

          <p className="
            mb-0 mt-1 text-[11px]
            text-[#64748b]
          ">
            Sua jornada financeira
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;