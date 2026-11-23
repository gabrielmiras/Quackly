
import logo from '../assets/logo-quackly.png';

function Footer() {
  const linkClass = `
    text-[0.85rem] text-[#94a3b8]
    !no-underline
    transition-colors duration-300
    hover:!text-[#FFCB61]
    hover:!no-underline
  `;

  return (
    <footer className="
      mt-16 border-t border-white/10
      bg-[#142238]
      pt-10 pb-3
    ">
      <div className="
        mx-auto w-full max-w-[1320px]
        px-6 sm:px-8
      ">

        {/* CONTEÚDO PRINCIPAL */}
        <div className="
          mb-9 grid
          grid-cols-1 gap-7
          sm:grid-cols-2
          lg:grid-cols-3
        ">

          {/* IDENTIDADE */}
          <div className="
            flex flex-col items-start text-left
          ">
            <a
              href="#top"
              className="
                mb-3 flex items-center gap-2
                text-lg font-bold text-white
                !no-underline hover:!no-underline
              "
            >
              <img
                src={logo}
                alt="Logo Quackly"
                className="h-[42px] w-[42px] object-contain"
              />

              <span>Quackly</span>
            </a>

            <p className="
              max-w-[260px]
              text-left text-[0.82rem] leading-relaxed
              text-[#94a3b8]
            ">
              Seu dinheiro sob controle.
              Aprenda, organize e evolua com o Quackly.
            </p>
          </div>

          {/* PRODUTO */}
          <div className="
            flex flex-col items-center
            lg:items-start
          ">
            <h4 className="
              mb-4 text-[0.9rem] font-bold
              tracking-wide text-white
            ">
              Produto
            </h4>

            <ul className="
              flex list-none flex-col items-center gap-3 p-0
              lg:items-start
            ">
              <li>
                <a href="#features" className={linkClass}>
                  Recursos
                </a>
              </li>

              <li>
                <a href="#mentor" className={linkClass}>
                  Mentor Virtual
                </a>
              </li>

              <li>
                <a href="#top" className={linkClass}>
                  Início
                </a>
              </li>
            </ul>
          </div>

          {/* GITHUB */}
          <div className="
            flex flex-col items-center
            lg:items-start
          ">
            <h4 className="
              mb-3 text-[0.9rem] font-bold
              tracking-wide text-white
            ">
              Acompanhe o projeto
            </h4>

            <a
              href="https://github.com/gabrielmiras/Quackly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Quackly no GitHub"
              className="
                inline-flex items-center gap-1.5
                rounded-lg border border-white/10
                bg-white/5 px-2.5 py-2
                text-[#cbd5e1]
                !no-underline hover:!no-underline
                transition-all duration-300
                hover:border-[#FFCB61]/40
                hover:bg-white/10
                hover:text-[#FFCB61]
              "
            >
              <i className="bi bi-github text-base" />

              <span className="text-[0.75rem] font-medium">
                GitHub do Quackly
              </span>

              <i className="bi bi-arrow-up-right text-[0.6rem]" />
            </a>

            <p className="
              mt-2 text-center text-[0.7rem]
              text-[#64748b]
            ">
              Confira o desenvolvimento do projeto.
            </p>
          </div>
        </div>

        {/* RODAPÉ INFERIOR */}
        <div className="
          flex flex-col items-center
          justify-between gap-2
          border-t border-white/10
          pt-3 pb-0 text-center
          sm:flex-row sm:text-left
        ">
          <p className="text-[0.75rem] text-[#64748b]">
            © 2026 Quackly. Todos os direitos reservados.
          </p>

          <a
            href="#top"
            className="
              flex items-center gap-2
              text-[0.75rem] font-medium
              text-[#94a3b8]
              !no-underline hover:!no-underline
              transition-colors duration-300
              hover:text-[#FFCB61]
            "
          >
            Voltar ao topo
            <i className="bi bi-arrow-up-circle" />
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
