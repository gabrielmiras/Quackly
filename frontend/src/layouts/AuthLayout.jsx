
import { Link } from 'react-router-dom';
import logo from '../assets/logo-quackly.png';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="
      flex min-h-screen
      items-center justify-center
      bg-[#0f172a] p-6
      text-white
    ">
      <div
        className="
          flex w-full max-w-[480px]
          flex-col items-center
          rounded-3xl
          bg-[#162238]
          px-8 py-10
          shadow-[0_16px_40px_rgba(0,0,0,0.4)]
        "
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Identidade */}
        <div className="mb-6 flex flex-col items-center">
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
            text-[1.1rem]
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
