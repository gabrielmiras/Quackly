
import logo from '../assets/logo-quackly.png';

function Footer() {
  return (
    <footer className="
      mt-20 border-t border-[#333333]
      bg-[rgba(30,30,30,0.9)]
      pt-12 pb-4
    ">
      <div className="mx-auto w-full max-w-[1320px] px-3">
        <div className="
          mb-8 grid
          grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
          gap-8
        ">
          {/* Identidade */}
          <div>
            <div className="
              mb-3 flex items-center gap-3
              text-[1.1rem] font-bold
            ">
              <img
                src={logo}
                alt="Logo Quackly"
                className="w-[50px]"
              />

              <span>
                Quackly
                <p className="text-[0.9rem] font-normal text-[#94a3b8]">
                  Seu dinheiro sob controle.
                </p>
              </span>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="
              mb-4 text-[0.95rem]
              font-normal text-[#f1f5f9]
            ">
              Produto
            </h4>

            <ul className="list-none p-0">
              <li className="mb-3">
                <a
                  href="#features"
                  style={{ textDecoration: 'none' }}
                  className="
                    text-[0.9rem] !text-[#94a3b8]
                    !no-underline hover:!no-underline
                    transition-colors duration-300
                    hover:!text-[#FFCB61]
                  "
                >
                  Recursos
                </a>
              </li>

              <li className="mb-3">
                <a
                  href="#mentor"
                  style={{ textDecoration: 'none' }}
                  className="
                    text-[0.9rem] !text-[#94a3b8]
                    !no-underline hover:!no-underline
                    transition-colors duration-300
                    hover:!text-[#FFCB61]
                  "
                >
                  Mentor Virtual
                </a>
              </li>

              <li className="mb-3">
                <a
                  href="#pricing"
                  style={{ textDecoration: 'none' }}
                  className="
                    text-[0.9rem] !text-[#94a3b8]
                    !no-underline hover:!no-underline
                    transition-colors duration-300
                    hover:!text-[#FFCB61]
                  "
                >
                  Benefícios
                </a>
              </li>
            </ul>
          </div>

          {/* Disponibilidade */}
          <div>
            <h4 className="
              mb-4 text-[0.95rem]
              font-normal text-[#f1f5f9]
            ">
              Disponível em
            </h4>

            <div className="flex gap-4">
              <a
                href="https://github.com/gabrielmiras/Quackly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quackly no GitHub"
                style={{ textDecoration: 'none' }}
                className="
                  inline-block text-white
                  !no-underline hover:!no-underline
                  transition-transform duration-300
                  hover:scale-110
                "
              >
                <i className="bi bi-github text-[30px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="
          border-t border-[#333333]
          pt-8 text-center
          text-[0.85rem] text-[#94a3b8]
        ">
          <p>© 2026 Quackly</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
