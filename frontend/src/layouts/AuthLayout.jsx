import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo-quackly.png';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="
      flex min-h-screen
      items-center justify-center
      bg-[#0f172a] p-4 sm:p-6
      text-white
    ">
    <div
      className="
        relative flex w-full max-w-[480px]
        flex-col items-center
        rounded-3xl
        bg-[#162238]
        px-6 py-8 sm:px-8 sm:py-10
        shadow-[0_16px_40px_rgba(0,0,0,0.4)]
      "
      style={{
        border: '1px solid #2b3d59',
        outline: 'none',
      }}
    >
        {/* Botão voltar */}
        <Link
          to="/"
          className="
            mb-6 inline-flex self-start
            items-center gap-2
            text-sm font-medium
            text-[#94a3b8]
            !no-underline
            transition-colors duration-200
            hover:text-[#FFCB61]
            hover:!no-underline
          "
        >
          <ArrowLeft size={18} />
          Voltar para início
        </Link>

        {/* Identidade */}
        <div className="mb-8 flex flex-col items-center">
          <div className="
            mb-4 flex h-[100px] w-[100px]
            items-center justify-center
            overflow-hidden
          ">
            <Link to="/" className="flex items-center justify-center">
              <img
                src={logo}
                alt="Logo Quackly"
                className="scale-[0.67]"
              />
            </Link>
          </div>

          <h2 className="
            mb-2 text-[1.6rem]
            font-bold text-white
          ">
            {title}
          </h2>

          <p className="
            text-center text-[1.1rem]
            font-semibold text-[#94a3b8]
          ">
            {subtitle}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="flex w-full flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
