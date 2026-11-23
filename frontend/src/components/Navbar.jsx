
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import Button from './Button.jsx';
import logo from '../assets/logo-quackly.png';

const NAV_LINKS = [
  { href: '#features', label: 'Recursos' },
  { href: '#mentor', label: 'Mentor Virtual' },
  { href: '#pricing', label: 'Benefícios' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent">
      <div
        className="
          mx-auto mt-5 flex w-[95%] max-w-[850px]
          items-center justify-between
          rounded-full border border-[#EBECF0]
          bg-black/70 px-[30px] py-[10px]
          shadow-[0_10px_30px_rgba(0,0,0,0.5)]
          backdrop-blur-xl
          max-[991px]:mt-[10px]
          max-[991px]:rounded-[25px]
        "
      >
        {/* LOGO */}
        <a
          href="#top"
          onClick={closeMenu}
          className="
            -mr-[10px] flex shrink-0 items-center
            text-[1.4rem] font-bold text-white
            !no-underline hover:!no-underline
          "
        >
          <img
            src={logo}
            alt="Logo Quackly"
            className="mr-[10px] h-[30px] w-[30px] scale-110 object-contain"
          />
          Quackly
        </a>

        {/* LINKS DESKTOP */}
        <div className="hidden items-center justify-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                text-[1.1rem] font-medium text-[#EBECF0]
                !no-underline hover:!no-underline
                transition-colors duration-300
                hover:text-[#FFCB61]
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* BOTÃO ENTRAR DESKTOP */}
        <div className="hidden lg:block">
          <Button variant="nav" to="/login">
            Entrar
          </Button>
        </div>

        {/* BOTÃO MENU MOBILE */}
        <button
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="
            flex items-center justify-center
            border-0 bg-transparent p-2 text-white
            lg:hidden
          "
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* MENU MOBILE */}
        {isOpen && (
          <div
            className="
              absolute left-0 right-0 top-full mx-auto mt-3
              flex w-[95%] flex-col items-center gap-5
              rounded-2xl border border-white/20
              bg-[#192841] p-6 shadow-xl
              lg:hidden
            "
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="
                  text-base font-medium text-[#EBECF0]
                  !no-underline hover:!no-underline
                  transition-colors
                  hover:text-[#FFCB61]
                "
              >
                {link.label}
              </a>
            ))}

            <Button variant="nav" to="/login" onClick={closeMenu}>
              Entrar
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
