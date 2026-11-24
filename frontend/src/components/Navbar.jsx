import { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';

import Button from './Button.jsx';
import logo from '../assets/logo-quackly.png';

const NAV_LINKS = [
  { href: '#features', label: 'Recursos' },
  { href: '#mentor', label: 'Mentor Virtual' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const closeTimer = useRef(null);

  const closeMenu = () => {
    setIsOpen(false);

    clearTimeout(closeTimer.current);

    closeTimer.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      clearTimeout(closeTimer.current);

      setIsVisible(true);

      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent">
      <div
        className="
          relative mx-auto mt-5 flex w-[95%] max-w-[850px]
          items-center justify-between
          rounded-full border border-white/20
          bg-black/75 px-[30px] py-[10px]
          shadow-[0_10px_30px_rgba(0,0,0,0.35)]
          backdrop-blur-xl

          max-[991px]:mt-4
          max-[991px]:w-[90%]
          max-[991px]:px-5
          max-[991px]:py-[8px]
        "
      >
        {/* LOGO */}
        <a
          href="#top"
          onClick={closeMenu}
          className="
            flex shrink-0 items-center
            text-[1.4rem] font-bold text-white
            !no-underline hover:!no-underline
            max-[991px]:text-[1.25rem]
          "
        >
          <img
            src={logo}
            alt="Logo Quackly"
            className="
              mr-[10px] h-[30px] w-[30px]
              scale-110 object-contain
              max-[991px]:mr-2
              max-[991px]:h-[30px]
              max-[991px]:w-[30px]
            "
          />

          Quackly<span className="text-[#FFCB61]">.</span>
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

        {/* ENTRAR DESKTOP */}
        <div className="hidden lg:block">
          <Button variant="nav" to="/login">
            Entrar
          </Button>
        </div>

        {/* BOTÃO MENU MOBILE */}
        <button
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          onClick={toggleMenu}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full border-0
            bg-transparent text-white
            transition-colors duration-200
            hover:bg-white/10
            lg:hidden
          "
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* MENU MOBILE */}
        {isVisible && (
          <div
            aria-hidden={!isOpen}
            className={`
              absolute left-0 right-0 top-full mx-auto mt-3
              flex w-full flex-col items-center gap-5
              rounded-[24px] border border-white/15
              bg-[#111d30]/95 p-6
              shadow-[0_12px_35px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
              lg:hidden

              transition-all duration-300 ease-in-out

              ${isOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-3 opacity-0 pointer-events-none'
              }
            `}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                tabIndex={isOpen ? 0 : -1}
                onClick={closeMenu}
                className="
                  text-base font-bold text-white
                  !no-underline hover:!no-underline
                  transition-colors duration-200
                  hover:text-[#FFCB61]
                "
              >
                {link.label}
              </a>
            ))}

            {/* BOTÃO ENTRAR */}
            <div className="flex w-full justify-center">
              <Button
                variant="nav"
                to="/login"
                onClick={closeMenu}
                className="
                  !mx-auto !w-[150px]
                  !flex !items-center !justify-center
                  !text-center !font-bold
                "
              >
                Entrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
